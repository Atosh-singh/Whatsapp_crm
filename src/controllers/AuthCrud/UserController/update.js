const {User} = require('../../../models/User');


const updateUser = async( req , res) =>{
    try {
       const {id} = req.params;
       const {username, fullname} = req.body; 

     const user = await User.findById(id);
     if(!user) {
        return res.status(400).json({
            success: true,
            message:"User Not Found!"
        })
     }



    const updatedUser=    await User.findByIdAndUpdate(id, {
        username,
        fullname
       }, {new:true})
        

       return res.status(200).json({
        success: true,
        message:"User Updated Successfully!"
       })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports={updateUser}