// adminRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Upload = require('../models/File');

// Get all users (with uploads maybe)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // no password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user by id
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    // optionally, delete all uploads by this user as well
    await Upload.deleteMany({ user: userId });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete upload by id
router.delete('/uploads/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const uploadId = req.params.id;
    await Upload.findByIdAndDelete(uploadId);
    res.json({ message: 'Upload deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
