const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Dashboard access granted',
    user: req.user,
  });
});

module.exports = router;
