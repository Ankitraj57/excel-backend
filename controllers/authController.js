const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (user) => {
  try {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS256'
    });
    
    if (!token) {
      throw new Error('Failed to generate token');
    }
    
    console.log('Generated token:', token);
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password: hashedPassword, 
      role: role?.toLowerCase() || 'user'
    });
    
    await user.save();
    console.log('User created successfully:', user._id);

    const token = generateToken(user);
    if (!token) {
      console.error('Failed to generate token for user:', user._id);
      return res.status(500).json({ message: 'Failed to generate token' });
    }

    res.status(201).json({ 
      jwt: token,
      user: user.toObject({ getters: true })
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid login attempt:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    if (!token) {
      console.error('Failed to generate token for user:', user._id);
      return res.status(500).json({ message: 'Failed to generate token' });
    }

    res.json({
      jwt: token,
      user: user.toObject({ getters: true })
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
