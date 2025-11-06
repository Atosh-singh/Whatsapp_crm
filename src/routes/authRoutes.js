const express = require('express');


const router = express.Router();
const {loginUser,generateOtp } = require('../controllers/AuthCrud/AuthCrudController/login');
const {verifyEmail} = require('../controllers/AuthCrud/AuthCrudController/verifyEmail')



// Routes
router.post('/generate-otp', generateOtp);
router.post('/login', loginUser)

// Route to verify email using the token
router.get('/verify-email/:token', verifyEmail)


module.exports = router;