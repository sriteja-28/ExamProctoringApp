const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    const user = await User.create({ email, password });
    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (err) {
    console.error("Error in register:", err.stack);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account is not active. Please contact support for activation.' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, isActive: user.isActive },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );
    
    res.json({ token });
  } catch (err) {
    console.error("Error in login:", err.stack);
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};


