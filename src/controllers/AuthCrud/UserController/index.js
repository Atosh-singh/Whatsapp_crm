const {otpAndVerifyRegister} = require('./register');
const {readAllUser, readUserById} = require('./read')
const {updateUser} = require('./update')

const {deleteUser} = require('./delete')


module.exports={
   otpAndVerifyRegister,
    readAllUser,
    readUserById,
    updateUser,
deleteUser

}