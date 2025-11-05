const jwt = require('jsonwebtoken');
const {User} = require('../../models/User');
require('dotenv').config();

const authenticate = async (req, res) =>{
    try{

        //Get token either from header or cookies
        let token = null;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message:'No authentication token, authorization denied.',
                jwtExpired: true,
            })
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({
                success: false,
                message:'Token verification failed, authorization denied.',
                jwtExpired: true,
            })
        }

        // Validate User Existence
        const user = await User.findOne({
            _id: decoded.userId,
            remove: false
        })

        if(!user) {
            return res.status(401).json({
                success: false,
                message:"User don't exist, authorization denied.",
                jwtExpired: true,
            })
        }

        // Attach user document to request
        req.user = user;

        next();   // move to next middleware/controller

    }catch(error){

        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success: false,
                message: 'Session expired, please log in again.',
                jwtExpired: true,
            })

        }

        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({
                success: false,
                message:'Invalid token, authorization denied.',
                jwtExpired: true,
            })
        }

        return res.status(503).json({
            success: false,
            message: 'Service unavailable, please try again later.',
            error: error.message,
        })
    }
}


module.exports = {authenticate}