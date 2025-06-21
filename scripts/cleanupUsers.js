const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;

const cleanupUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find and remove invalid users (users with invalid IDs)
    const invalidUsers = await User.find({
      _id: { $exists: true, $ne: { $type: 'objectId' } }
    });

    if (invalidUsers.length > 0) {
      console.log(`Found ${invalidUsers.length} invalid users`);
      const deletedCount = await User.deleteMany({
        _id: { $exists: true, $ne: { $type: 'objectId' } }
      });
      console.log(`Deleted ${deletedCount.deletedCount} invalid users`);
    } else {
      console.log('No invalid users found');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error during user cleanup:', error);
    process.exit(1);
  }
};

cleanupUsers();
