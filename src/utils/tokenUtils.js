const jwt = require('jsonwebtoken');

// Function to generate a verification token
const generateVerificationToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateVerificationToken };
