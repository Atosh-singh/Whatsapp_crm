const {createGroup}= require('../../../services/groupService');

const createGroupController = async (req , res) =>{
   
       const {adminId, groupName, memberIds, groupImage}   = req.body;
    try {
    const newGroup = await createGroup(adminId, groupName, memberIds, groupImage);
    res.status(201).json({
        success: true,
        message: 'Group created successfully!',
        data: newGroup
    })

        
    } catch (error) {
         res.status(500).json({
      success: false,
      message: error.message
         });
    }
}


module.exports = {createGroupController}