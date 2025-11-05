const { Message } = require('../../../models/Message');
const { Chat } = require('../../../models/Chat');
const fs = require('fs');
const path = require('path');

// Send Message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, messageType, chatId, groupId } = req.body;
    let mediaPath = null;

    // Step 1: Check if the chat already exists (direct chat between sender and receiver)
    let chat;

    // If chatId is not provided, look for an existing chat
    if (!chatId) {
      // Look for a chat between the two users (either sender and receiver or receiver and sender)
      chat = await Chat.findOne({
        type: 'direct',
        users: { $all: [senderId, receiverId], $size: 2 }
      });

      // Step 2: If chat doesn't exist, create a new one
      if (!chat) {
        chat = new Chat({
          users: [senderId, receiverId],
          type: 'direct'
        });
        await chat.save();  // Save the new chat
      }
    } else {
      // If chatId is provided, use the existing chatId
      chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ success: false, message: 'Chat not found' });
      }
    }

    // Step 3: Ensure chat.messages is initialized
    if (!chat.messages) {
      chat.messages = []; // Initialize the messages array if it's undefined
    }

    // Step 4: Handle media upload if any (for non-text messages)
    if (req.file && messageType !== 'text') {
      const uploadDir = path.join(__dirname, '../../../../public/messages');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const filename = Date.now() + '-' + req.file.originalname;
      fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
      mediaPath = `public/messages/${filename}`;  // store relative path to the uploaded media
    }

    // Step 5: Create the message
    const newMessage = new Message({
      sender: senderId,
      receiver: groupId ? null : receiverId, // null for group messages
      groupId: groupId || null,
      chatId: chat._id, // link message to the chat
      message: message || '',
      messageType: messageType || 'text',
      mediaPath
    });

    await newMessage.save();

    // Step 6: Link the message to the chat
    chat.messages.push(newMessage._id);  // Add the message ID to the messages array
    await chat.save();

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { sendMessage };
