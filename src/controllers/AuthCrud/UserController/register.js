const { User } = require('../../../models/User');
const crypto = require('crypto');
const { upload } = require('../../../utils/uploadFile');
const fs = require('fs');
const path = require('path');

const otpObj = {}; // stores OTPs per phone

const sendOtpToPhone = (phone, otp) => {
  console.log(`OTP for ${phone} : ${otp}`);
};

const otpAndVerifyRegister = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });

      const { phone, otp, fullname, email, username } = req.body;
      const fileBuffer = req.file ? req.file.buffer : null;
      const originalName = req.file ? req.file.originalname : null;

      if (!phone) return res.status(400).json({ success: false, message: 'Phone number is required!' });

      // Prevent duplicate registration
      const user = await User.findOne({ phone });
      const emailUser = email ? await User.findOne({ email }) : null;

      // ---- OTP Verification Flow ----
      if (otp && fullname && username && email) {
        const otpData = otpObj[phone];

        if (!otpData || otpData.otp !== otp || otpData.expired) {
          return res.status(400).json({
            success: false,
            message: otpData && otpData.expired ? 'OTP has expired' : 'Invalid OTP',
          });
        }

        if (user || emailUser) {
          return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Save file after OTP verification
        let profilePicPath = null;
        if (fileBuffer && originalName) {
          const uploadDir = path.join(__dirname, '../../../../public/profilePics');
          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
          const filename = Date.now() + path.extname(originalName);
          fs.writeFileSync(path.join(uploadDir, filename), fileBuffer);
          profilePicPath = `public/profilePics/${filename}`;
        }

        const newUser = new User({
          phone,
          fullname,
          username,
          email,
          isVerified: true,
          profilePic: profilePicPath, // ✅ corrected variable
        });

        await newUser.save();

        // OTP is used, delete it
        delete otpObj[phone];

        return res.status(200).json({ success: true, message: 'OTP verified successfully. User registered.' });
      }

      // ---- OTP Generation Flow ----
      if (user || emailUser) return res.status(400).json({ success: false, message: 'User already exists' });

      // Generate new OTP
      const generatedOtp = crypto.randomInt(100000, 999999).toString();
      otpObj[phone] = { otp: generatedOtp, expired: false };

      // Set expiry (5 min)
      setTimeout(() => {
        if (otpObj[phone]) otpObj[phone].expired = true;
      }, 50 * 60 * 1000);

      sendOtpToPhone(phone, generatedOtp);

      return res.status(200).json({ success: true, message: 'OTP generated and sent to phone' });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { otpAndVerifyRegister };
