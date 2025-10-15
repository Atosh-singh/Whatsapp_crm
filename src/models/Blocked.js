const mongoose = require('mongoose');

const blockedUserSchema = new mongoose.Schema({
    blocker:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    blocked:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    blockedAt:{
        type: Date,
        default: Date.now
    }
})


const BlockedUser = mongoose.model('BlockedUser', blockedUserSchema);
module.exports = {BlockedUser}