const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (userId, username) =>
  jwt.sign({ id: userId, username }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { username, password, registeredDate, functionType } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already exists' });
    const user = await User.create({ username, password, registeredDate, functionType });
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user._id, user.username);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        functionType: user.functionType,
        registeredDate: user.registeredDate
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
