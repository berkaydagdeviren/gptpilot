const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const router = express.Router();

// Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!role) {
      console.log('Registration attempt without specifying role');
      return res.status(400).json({ message: 'Role is required' });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('Attempt to register with an already registered email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('User registered successfully:', username);
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error registering new user:', error);
    res.status(500).json({ message: 'Error registering new user', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid login attempt for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('User logged in successfully:', user.username);
    res.json({ message: 'User logged in successfully', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;