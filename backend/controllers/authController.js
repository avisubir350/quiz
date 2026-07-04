const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      const user = await User.create({ username, email, password });
      const token = generateToken(user);

      res.status(201).json({ success: true, message: 'Registration successful', token, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
];

exports.login = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Account is deactivated' });
      }

      const token = generateToken(user);
      res.json({ success: true, message: 'Login successful', token, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
];

exports.getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};
