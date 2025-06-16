const File = require('../models/File'); // Import model as File
const parseExcel = require('../utils/excelParser');
const fs = require('fs');
const path = require('path');


exports.uploadFile = async (req, res) => {
    console.log('uploadFile controller called'); 
  try {
    if (!req.file) {
      console.error('No file in request:', req);
      return res.status(400).json({ message: 'No file uploaded.', details: 'No file found in request' });
    }

    console.log('File details:', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    });

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      console.error('Invalid file type:', req.file.mimetype);
      return res.status(400).json({ 
        message: 'Invalid file type. Please upload an Excel file.',
        details: `Received file type: ${req.file.mimetype}`
      });
    }

    console.log('Attempting to parse file:', req.file.path);
    const parsedData = await parseExcel(req.file.path);
    console.log('File parsed successfully');

    console.log('Attempting to create file record');
    const record = await File.create({
      user: req.user._id,
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      parsedData,
    });

    console.log('File record created successfully:', record);
    res.status(200).json(record);
  } catch (error) {
    console.error('Detailed upload error:', {
      error: error.message,
      stack: error.stack,
      file: req?.file,
      user: req?.user
    });
    
    // Send more detailed error message to client
    res.status(500).json({ 
      message: error.message || 'Server error during file upload.',
      details: {
        errorType: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : 'Stack trace hidden in production'
      }
    });
  }
};


exports.getUploadHistory = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(files);
  } catch (error) {
    console.error('Upload history error:', error);
    res.status(500).json({ message: 'Failed to fetch upload history' });
  }
};


exports.getChartData = async (req, res) => {
  try {
    const latest = await File.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ message: 'No data found' });

    res.json({ data: latest.parsedData });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ message: 'Server error fetching chart data.' });
  }
};
exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;

    // Validate file ID
    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    // Find the file by ID and user to ensure ownership
    const file = await File.findOne({ _id: fileId, user: req.user._id });
    if (!file) {
      return res.status(404).json({ 
        message: 'File not found or unauthorized',
        details: 'No file found with the specified ID for this user'
      });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`File deleted from filesystem: ${filePath}`);
      } else {
        console.log(`File not found in filesystem: ${filePath}`);
      }
    } catch (err) {
      console.error('Error deleting file from filesystem:', err);
      return res.status(500).json({ 
        message: 'Failed to delete file from storage',
        details: err.message
      });
    }

    // Delete file document from DB
    try {
      await file.deleteOne();
      console.log(`File record deleted from database: ${fileId}`);
    } catch (err) {
      console.error('Error deleting file record:', err);
      return res.status(500).json({ 
        message: 'Failed to delete file record',
        details: err.message
      });
    }

    res.status(200).json({ 
      message: 'File deleted successfully',
      fileId,
      details: {
        filename: file.originalname,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Delete file error:', {
      error: error.message,
      stack: error.stack,
      fileId: req.params.id,
      userId: req.user?._id
    });
    
    res.status(500).json({ 
      message: 'Failed to delete file',
      details: error.message
    });
  }
};