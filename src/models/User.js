const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: true
  },
  remove: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
  },
  fullname: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  phone: {
    type: String,
    required: true,
  
  },
  role:{
    type: String,
    enum:['user', 'admin', 'superadmin'], // Fixed roles
    default:'user'  // Default role can be 'user'
  },
  password: {
    type: String,  // hashed password
  },
  profilePic: {
    type: String,  // URL to profile picture
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,   // Track if the user is online
    default: false
  },
  lastSeen: {
    type: Date,    // Track the last time the user was online
    default: Date.now
  },
  chats: [{   // Reference to the chats the user is part of
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }],
  otp: {
    type: String
  }, // Optional, store OTP temporarily
  otpExpiresAt: {
    type: Date
  },
  status: {
    type: String,
    default: 'Hey I am using WhatsApp!'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = { User };
