const {Chat}= require('../../models/Chat');

const chat = async (req, res) =>{
try{
const {message}=req.body;
const chat =   await new Chat({
    message
})
const userChat = await chat.save();

return res.status(200).json({
    success: true,
    message:"Chat created successfully!",
    chat: userChat
})

}catch(error){
    return res.status(500).rs.json({
        success: false,
        message: error.message
    })
}
}



module.exports = {chat}