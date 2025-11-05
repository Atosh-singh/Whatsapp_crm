const express = require('express');
const {sendMessage, fetchMessages} = require('../controllers/Chat/Message')

const { upload } = require('../utils/uploadFile');
const {authenticate} = require('../middlewares/authenticate')

const routes = express.Router();

// Route to send a message (with file upload)
routes.post('/send-message',authenticate, upload, sendMessage);
routes.get('/fetch-chat-message/:id',authenticate, fetchMessages);

module.exports = routes;
