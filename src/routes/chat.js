const express = require('express');

const router = express.Router();

const { chat} = require('../controllers/Chat/chat')

router.post('/userchat',chat)

module.exports = router;