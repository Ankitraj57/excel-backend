// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.error('No Authorization header found');
      return res.status(401).json({ 
        message: 'Authentication required', 
        details: 'No Authorization header in request' 
      });
    }

    // Verify the header format
    if (!authHeader.startsWith('Bearer ')) {
      console.error('Invalid Authorization header format');
      return res.status(401).json({ 
        message: 'Authentication required', 
        details: 'Invalid Authorization header format. Expected: Bearer <token>' 
      });
    }

    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.error('No token found in Authorization header');
      return res.status(401).json({ 
        message: 'Authentication required', 
        details: 'No token found in Authorization header' 
      });
    }

    // Verify JWT_SECRET is present
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not found in environment variables');
      return res.status(500).json({ 
        message: 'Server error', 
        details: 'JWT_SECRET not configured' 
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256']
      });

      // Validate token payload
      if (!decoded.id || !decoded.email || !decoded.role) {
        console.error('Invalid token payload');
        return res.status(401).json({ 
          message: 'Authentication required', 
          details: 'Invalid token payload' 
        });
      }

      // Find user
      const user = await User.findOne({
        _id: decoded.id,
        email: decoded.email
      }).select('-password');

      if (!user) {
        console.error(`User not found: ${decoded.id}`);
        return res.status(401).json({ 
          message: 'Authentication required', 
          details: 'User not found' 
        });
      }

      // Verify role
      if (user.role !== decoded.role) {
        console.error(`Role mismatch: token (${decoded.role}) != user (${user.role})`);
        return res.status(401).json({ 
          message: 'Authentication required', 
          details: 'Role mismatch' 
        });
      }

      // Add user to request
      req.user = user;
      next();

    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ 
        message: 'Authentication required', 
        details: 'Invalid or expired token',
        error: err.message
      });
    }
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(500).json({
      message: 'Internal server error',
      details: 'Authentication failed'
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
