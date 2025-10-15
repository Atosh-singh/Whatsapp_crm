const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'                // User receiving the notification
    },
    message:{
        type: String,         // The notification message
        required: true  
    },

    type:{
        type: String,
        enum:['message', 'mntion'],
         default:'message'
    },
    seen:{ type: Boolean,
        default: false            // Whether the notification has been seen
    },
    isRead:{
         type: Boolean, 
         default: false ,  // Track whether the notification is read
    }
},{timestamps:true});


const Notification = mongoose.model('NOtification', notificationSchema);

module.exports = { Notification };