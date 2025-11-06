const jwt = require('jsonwebtoken');
const { User } = require('../../../models/User');

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;  // Extract token from the URL route parameter

    console.log('Token:', token);  // Log the token to see if it's being passed correctly

    // Decode the verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token.',
      });
    }

    // Find the user by decoded userId
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email successfully verified.',
    });
  } catch (error) {
    console.error(error);  // Log any errors for debugging
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { verifyEmail };
