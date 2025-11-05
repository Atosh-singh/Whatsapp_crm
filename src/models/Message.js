const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: String,
  messageType: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text'
  },
  chatId: {  // This is where chatId is saved to link the message to the specific chat
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  mediaPath: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = { Message };
