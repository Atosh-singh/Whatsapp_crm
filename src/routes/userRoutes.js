const express = require('express');

const router = express.Router();

const {otpAndVerifyRegister,readAllUser, readUserById,deleteUser, updateUser} = require('../controllers/AuthCrud/UserController')

const {verifyEmail} = require('../controllers/AuthCrud/AuthCrudController/verifyEmail')

const {uploadFile} = require('../utils/uploadFile')

router.post('/register-user',otpAndVerifyRegister)
router.get('/read-user',readAllUser)
router.get('/read-user/:id',readUserById)
router.delete('/delete-user/:id', deleteUser)
router.put('/update-user/:id', updateUser);



// Verify User Email
router.get('/verify-email/:token', verifyEmail);


module.exports= router;