const File = require('../models/File');

exports.getDashboardData = async (req, res) => {
  try {
    const uploads = await File.find({ user: req.user._id }).sort({ createdAt: -1 });
  const totalUploads = await File.countDocuments({ user: req.user.id });
    const lastUpload = await File.findOne({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      totalUploads,
      lastUploadDate: lastUpload?.createdAt || null,
      uploads,
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
};
