const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');  // Destructure here

const router = express.Router();

router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Dashboard access granted',
    user: req.user,
  });
});

module.exports = router;
