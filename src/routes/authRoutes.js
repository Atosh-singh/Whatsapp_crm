const express = require('express');


const router = express.Router();
const {loginUser,generateOtp } = require('../controllers/AuthCrud/AuthCrudController/login')


// Routes
router.post('/generate-otp', generateOtp);
router.post('/login', loginUser)


module.exports = router;