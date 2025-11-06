const { User } = require('../../../models/User');
const { sendEmail } = require('../../../utils/sendEmail');
const { generateVerificationToken } = require('../../../utils/tokenUtils');
const path = require('path');
const fs = require('fs');

const otpAndVerifyRegister = async (req, res) => {
  try {
    const { phone, fullname, email, username } = req.body;
    const fileBuffer = req.file ? req.file.buffer : null;
    const originalName = req.file ? req.file.originalname : null;

    // Check if phone or email already exists
    const user = await User.findOne({ phone });
    const emailUser = email ? await User.findOne({ email }) : null;

    if (user || emailUser) {
      return res.status(400).json({ success: false, message: 'User with this phone or email already exists' });
    }

    // Handle file upload if any
    let profilePicPath = null;
    if (fileBuffer && originalName) {
      const uploadDir = path.join(__dirname, '../../../../public/profilePics');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filename = Date.now() + path.extname(originalName);
      fs.writeFileSync(path.join(uploadDir, filename), fileBuffer);
      profilePicPath = `public/profilePics/${filename}`;
    }

    // Create a new user with isVerified set to false
    const newUser = new User({
      phone,
      fullname,
      username,
      email,
      profilePic: profilePicPath,
      role: 'user',  // Assign default role to the user
      isVerified: false,  // User is not verified initially
    });

    await newUser.save();

    // Generate a verification token for the email
    const verificationToken = generateVerificationToken(newUser._id);

    // Generate the verification URL (this will be the link in the email)
    const verificationUrl = `${process.env.CLIENT_URL}/api/users/verify-email/${verificationToken}`;

    // Send verification email with the token in the link
    const emailSent = await sendEmail(newUser.email, 'Verify Your Email', verificationUrl);

    if (!emailSent) {
      return res.status(500).json({ success: false, message: 'Error sending verification email.' });
    }

    return res.status(200).json({ success: true, message: 'User registered successfully. Please check your email to verify your account.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { otpAndVerifyRegister };
