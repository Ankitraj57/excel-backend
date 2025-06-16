const express = require('express');
const multer = require('multer');
const {
  uploadFile,
  getChartData,
  deleteFile,
  getUploadHistory,
} = require('../controllers/fileController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// Log to debug
// console.log('uploadFile:', typeof uploadFile);
// console.log('getUploads:', typeof getUploads);
// console.log('getChartData:', typeof getChartData);

router.post('/upload', verifyToken, upload.single('file'), uploadFile);
// router.get('/', verifyToken, getUploadHistory);
router.get('/chart-data', verifyToken, getChartData);
router.get('/history', verifyToken, getUploadHistory);
router.delete('/:id', verifyToken, deleteFile);

// AI Analysis route
router.post('/ai/analyze', verifyToken, async (req, res) => {
  try {
    const { fileId } = req.body;
    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    // Get the file from database
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Here we would normally call an AI service to analyze the data
    // For now, we'll create some mock insights
    const insights = [
      {
        title: 'Data Overview',
        description: 'Analysis of your Excel data',
        data: {
          rows: file.parsedData.length,
          columns: Object.keys(file.parsedData[0] || {}).length,
          timestamp: new Date().toISOString()
        }
      },
      {
        title: 'Data Structure',
        description: 'Analysis of your data structure',
        data: file.parsedData[0] || {}
      }
    ];

    res.json({ insights });
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze data' });
  }
});



module.exports = router;
