// adminRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { deleteUser } = require('../controllers/userController');
const { deleteUpload } = require('../controllers/uploadController');
const User = require('../models/User');
const Upload = require('../models/Upload');

// Get all users (with uploads maybe)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.aggregate([
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
          role: 1,
          totalUploads: { $size: '$uploads' },
          uploads: {
            $map: {
              input: '$uploads',
              as: 'upload',
              in: {
                _id: '$$upload._id',
                fileName: '$$upload.fileName',
                createdAt: '$$upload.createdAt',
                status: '$$upload.status',
                size: '$$upload.size',
                processed: '$$upload.processed',
                error: '$$upload.error'
              }
            }
          }
        }
      }
    ]);

    // Add user count summary
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const regularUsers = users.filter(user => user.role === 'user').length;

    res.json({
      users,
      summary: {
        totalUsers,
        adminUsers,
        regularUsers
      }
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
});

// Delete user
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    // Delete user and their uploads in a transaction
    await User.startSession();
    const session = User.db.client.startSession();
    try {
      await session.withTransaction(async () => {
        await User.deleteOne({ _id: userId }, { session });
        await Upload.deleteMany({ userId }, { session });
      });
      res.json({ message: 'User and their uploads deleted successfully' });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ 
      message: 'Error deleting user', 
      error: err.message 
    });
  }
});

// Delete upload
router.delete('/uploads/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const uploadId = req.params.id;
    const upload = await Upload.findById(uploadId);
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    await Upload.findByIdAndDelete(uploadId);
    res.json({ message: 'Upload deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
