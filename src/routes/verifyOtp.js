const express = require('express');
const Login = require('../models/Login');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { loginId, otp } = req.body;

    if (!loginId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Login ID and OTP are required',
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be a 6-digit code',
      });
    }

    const login = await Login.findByIdAndUpdate(
      loginId,
      { otp },
      { new: true }
    );

    if (!login) {
      return res.status(404).json({
        success: false,
        message: 'Login record not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified',
    });
  } catch (error) {
    console.error('OTP error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
