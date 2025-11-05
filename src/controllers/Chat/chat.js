const { Chat } = require('../../models/Chat');
const { Message } = require('../../models/Message');

// Create a new chat (direct or group)
const createChat = async (req, res) => {
 try {
  const {users, type, groupName, groupImage} = req.body;

  if(!users || users.length <1){
    return res.status(400).json({
      success: false,
      message:"Atleast one user is required"
    })
  }
  
// For direct chat, check if chat already exists between two users
if(type ==='direct' && users.length ===2){
  const existingChat = await Chat.findOne({
    type:'direct',
    users:{$all:users, $size:2}
  });

  if(existingChat){
    return res.status(200).json({
      success: true,
      message:"Chat already exists!",
      chat: existingChat
    })
  }
}

// For group chat, you can check if a chat with the same group name exists
if(type ==='group' && groupName){
  const existingGroupChat = await Chat.findOne({
    type:'group',
    groupName: groupName
  })
  if(existingGroupChat){
    return res.status(200).json({
      success: true,
      message: "Group Chat already exists!",
      chat: existingGroupChat
    })
  }
}

 // Create new chat
 const newChat = await new Chat({
  users,
  type: type || 'direct',
  groupName: groupName || null,
  groupImage: groupImage || null
 })

 const savedChat = await newChat.save();
 return res.status(201).json({
  success: true,
  chat: savedChat
 })

 } catch (error) {
  return res.status(500).json({
    success: false,
    message: error.message
  })
 }
};

// Get all chats for a user
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ users: userId, enabled: true })
      .populate('users', 'username profilePic')
      .populate({
        path: 'messages',
        options: { sort: { createdAt: -1 }, limit: 1 }, // last message only
        populate: { path: 'sender', select: 'username profilePic' }
      })
      .sort({ updatedAt: -1 }); // latest active chats first

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get chat details by chatId (all messages)
const getChatDetails = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('users', 'username profilePic')
      .populate({
        path: 'messages',
        populate: { path: 'sender', select: 'username profilePic' },
        options: { sort: { createdAt: 1 } }
      });

    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    return res.status(200).json({ success: true, chat });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createChat, getUserChats, getChatDetails };
