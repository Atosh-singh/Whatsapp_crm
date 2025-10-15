const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'   // Sender of the media
    },
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Chat" // Chat to which this media belongs

    },
    mediaType:{
        type: String,
        enum:['image', 'audio', 'video', 'document'],
        required: true    // Type of media
    },

    url:{
        type: String,
        required: true
    },// URL to the media file (stored in cloud or local server)
    caption:{
        type: String,   // Optional caption for media
    }


}, {timestamps: true});


const Media = mongoose.model("Media", mediaSchema);

module.exports = {Media};