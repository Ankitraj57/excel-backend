const Upload = require('../models/File');

exports.deleteUpload = async (req, res) => {
  try {
    const uploadId = req.params.id;
    
    // Find the upload to check if exists
    const upload = await Upload.findById(uploadId);
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    // Delete the upload
    await Upload.findByIdAndDelete(uploadId);

    res.json({ message: 'Upload deleted successfully' });
  } catch (error) {
    console.error('Error deleting upload:', error);
    res.status(500).json({ message: 'Error deleting upload' });
  }
};
