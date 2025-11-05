const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: true
  },
  removed: {  // Changed to boolean
    type: Boolean,
    default: false
  },
  users: [{  // Users in this chat (for both personal and group chats)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{  // Messages in this chat
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  type: {  // 'direct' for personal chat, 'group' for group chat
    type: String,
    enum: ['direct', 'group'],
    default: 'direct'
  },
  groupId: {  // For group chats, reference to the Group model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null  // Only set for group chats
  },
  groupName: {  // Only for group chats
    type: String
  },
  groupImage: {  // Only for group chats
    type: String  // URL to the group image
  }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = { Chat };
