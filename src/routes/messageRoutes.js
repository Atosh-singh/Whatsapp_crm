const express = require('express');
const { sendMessage , fetchMessages} = require('../controllers/Chat/Message');
const { upload } = require('../utils/uploadFile');

const routes = express.Router();

// Route to send a message (with file upload)
routes.post('/send-message', upload, sendMessage);
routes.get('/fetch-chat-message/:id', fetchMessages);

module.exports = routes;
