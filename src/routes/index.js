const express = require('express');
const router = express.Router();



const userRoutes = require('./userRoutes')
const authRoutes = require('./authRoutes')
const chatRoutes= require('./chat')
const messageRoutes= require('./messageRoutes')



router.use("/users", userRoutes)
router.use('/auth', authRoutes)
router.use('/chat', chatRoutes)
router.use('/message', messageRoutes)
module.exports = router