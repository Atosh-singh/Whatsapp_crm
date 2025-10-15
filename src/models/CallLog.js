const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
caller:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
receiver:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
callType:{
    type: String,
    enum:['voice ', 'video'],
    required: true
},
callDuration:{
    type: Number,
    require: true
},
callStatus: {
    type: String,
    enum:['missed', 'answered', 'rejected'],
    required: true
}

}, {timestamps: true})

const CallLog = mongoose.model('CallLog', callLogSchema);
module.exports = {CallLog}