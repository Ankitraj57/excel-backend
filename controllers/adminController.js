// controllers/adminController.js

exports.getAdminData = (req, res) => {
  // Example admin-only data to send back
  const adminData = {
    usersCount: 123,
    reportsGenerated: 45,
    systemStatus: 'All systems operational',
  };

  res.json(adminData);
};
