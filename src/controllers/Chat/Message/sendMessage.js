const {Message} = require('../../../models/Message');
const fs = require('fs');
const path = require('path');

// Send Message Function

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, messageType, groupId } = req.body;
    let mediaPath = null;

    // Handle media upload if file exists
    if (req.file && messageType !== 'text') {
      const uploadDir = path.join(__dirname, '../../../../public/messages');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const filename = Date.now() + '-' + req.file.originalname;
      const filePath = path.join(uploadDir, filename);

      // Save file to disk
      fs.writeFileSync(filePath, req.file.buffer);

      // Update mediaPath to the location of the file
      mediaPath = `public/messages/${filename}`;
    }

    // Check if it's a group chat (groupId is provided)
    if (groupId) {
      // In case of group chat, `receiverId` will be an array of user IDs
      const receivers = receiverId;  // Expecting receiverId to be an array

      // Send the message to all users in the group
      for (const receiver of receivers) {
        const newMessage = new Message({
          sender: senderId,
          receiver: receiver,
          groupId,  // Add the group ID to each message
          message: message || '',  // Empty message if media is sent
          messageType: messageType || 'text',
          mediaPath
        });
        await newMessage.save();  // Save each message to the database
      }

      return res.status(200).json({
        success: true,
        message: 'Group message sent to all users',
      });
    }

    // Personal chat: One-to-One message
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message: message || '',  // Empty message if media is sent
      messageType: messageType || 'text',
      mediaPath
    });

    // Save message to the database
    await newMessage.save();

    return res.status(200).json({
      success: true,
      message: 'Personal message sent',
      data: newMessage
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




module.exports = {sendMessage}