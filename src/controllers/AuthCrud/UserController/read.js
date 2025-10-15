const { User } = require("../../../models/User");

const readAllUser = async (req, res) => {
  try {
    const getUser = await User.find();
    return res.status(200).json({
      success: true,
      message: "User details !",
      data: getUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const readUserById = async (req, res) =>{
try {
    
const {id} = req.params;
   
const getUserById = await User.findById(id);
return res.status(200).json({
    success: true,
    message:"User Id details !",
    data: getUserById
})

} catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message
    })
    
}
}

module.exports = { readAllUser,readUserById };
