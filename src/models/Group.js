const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true  // Group name is required
  },
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // Reference to the user who is the group admin
    required: true 
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'  // List of user IDs who are part of the group
  }],
  groupImage: { 
    type: String,  // URL to the group's image
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = { Group };
