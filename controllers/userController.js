const User = require('../models/User');
const Upload = require('../models/File');

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // First find the user to check if exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all uploads associated with this user
    await Upload.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User and associated uploads deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};
