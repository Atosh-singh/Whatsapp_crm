const jwt = require('jsonwebtoken');
const {User} = require('../../../models/User');
const crypto = require('crypto')
require('dotenv').config()

const otpObj = {};

const sendOtpToPhone = (phone, otp) => {
    console.log(`OTP for ${phone}: ${otp}`);
}



const loginUser = async(req , res) => {
    try{

        const {phone} = req.body;

        if(!phone){
            return res.status(400).json({
                success: false,
                message:"Phone number is required!"
            })
        };

        // Check if the user exists and is verified
        const user = await User.findOne({phone});
        if(!user){
            return res.status(404).json({
                success: false,
                message:"User not found"
            })
        }

        if (!user.isVerified){
            return res.status(400).json({
                success: false,
                message: "User not verified. Please verify your phone number."
            })

        }

// Generate JWT token
const token = jwt.sign(
    {
        userId: user._id,
        phone:user.phone
    },
    process.env.JWT_SECRET,
    {expiresIn:'24h'}
)

return res.status(200).json({
    success: true,
    message:"Login successful",
    token
})

    }catch(error){
        return res.status(500).json({
            uccess: false,
            message: error.message
        })
    }
}


module.exports= {loginUser}