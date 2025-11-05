const jwt = require('jsonwebtoken');
const { User } = require('../../../models/User');
const { sendEmail } = require('../../../utils/sendEmail');  // ✅ import email utility
require('dotenv').config();

const otpStore = {};

const sendOtpToPhone = (phone, otp) => {
  console.log(`📱 OTP for ${phone}: ${otp}`); // optional, for debugging
};

// Generate OTP and send to phone & email
const generateOtp = async (req, res) => {
  try {
    const { phone, email } = req.body;

    if (!phone && !email) {
      return res.status(400).json({
        success: false,
        message: 'Phone number or email is required!'
      });
    }

    const user = await User.findOne({ $or: [{ phone }, { email }] });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiry to 5 minutes
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Store OTP and expiry time
    otpStore[user.phone || user.email] = { otp, otpExpiresAt };

    // Send OTP via console & email
    sendOtpToPhone(user.phone, otp);

    if (user.email) {
      const html = `
        <div style="font-family:Arial,sans-serif;">
          <h2>OTP Verification</h2>
          <p>Your OTP for login is:</p>
          <h3 style="color:#4CAF50;">${otp}</h3>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `;
      await sendEmail(user.email, 'Your OTP Code', html);
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully via phone and/or email.'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Verify OTP and generate JWT
const loginUser = async (req, res) => {
  try {
    const { phone, email, otp } = req.body;

    if ((!phone && !email) || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone/email and OTP are required!'
      });
    }

    const user = await User.findOne({ $or: [{ phone }, { email }] });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if OTP exists and has expired
    const storedOtp = otpStore[user.phone || user.email];

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired!'
      });
    }

    // Check if OTP is expired
    if (storedOtp.otpExpiresAt < Date.now()) {
      delete otpStore[user.phone || user.email]; // Clear expired OTP
      return res.status(400).json({
        success: false,
        message: 'OTP has expired, please request a new one.'
      });
    }

    // Validate OTP
    if (storedOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP!'
      });
    }

    // Mark user as verified (if needed)
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Clear OTP from store
    delete otpStore[user.phone || user.email];

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
    generateOtp, loginUser
}