const User = require('../models/User');
const Upload = require('../models/Upload');

exports.getAdminData = async (req, res) => {
  try {
    // Get all users with their upload counts
    const usersWithStats = await User.aggregate([
      {
        $lookup: {
          from: 'uploads',
          localField: '_id',
          foreignField: 'userId',
          as: 'uploads'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          totalUploads: { $size: '$uploads' }
        }
      }
    ]);

    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
};

// Export existing functions
exports.deleteUser = require('./userController').deleteUser;
exports.deleteUpload = require('./uploadController').deleteUpload;
