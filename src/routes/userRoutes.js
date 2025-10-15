const express = require('express');

const router = express.Router();

const {otpAndVerifyRegister,readAllUser, readUserById,deleteUser, updateUser} = require('../controllers/AuthCrud/UserController')

const {uploadFile} = require('../utils/uploadFile')

router.post('/register-user',otpAndVerifyRegister)
router.get('/read-user',readAllUser)
router.get('/read-user/:id',readUserById)
router.delete('/delete-user/:id', deleteUser)
router.put('/update-user/:id', updateUser)



module.exports= router;