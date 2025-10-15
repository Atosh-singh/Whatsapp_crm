const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {  // For personal chats (one-to-one messages)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    default: null
  },
  groupId: {  // For group chats, references the group
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    default: null
  },
  message: {
    type: String,
    default: ''  // Optional for media messages
  },
  mediaPath: {  // Path for image/video/audio/file
    type: String,
    default: null
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file'],
    default: 'text'
  },
  status: {  // Track sent/delivered/read
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = { Message };
