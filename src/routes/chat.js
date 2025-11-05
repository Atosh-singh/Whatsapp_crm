const express = require('express');

const router = express.Router();

const { createChat, getUserChats, getChatDetails} = require('../controllers/Chat/chat');
const {authenticate} = require('../middlewares/authenticate')

// Route to create a new chat (direct or group)
router.post('/create',authenticate, createChat);

// Route to get all chats for a user
router.get('/user/:userId',authenticate, getUserChats);

// Route to get chat details by chatId (all messages)
router.get('/chat/:chatId',authenticate, getChatDetails);

module.exports = router;