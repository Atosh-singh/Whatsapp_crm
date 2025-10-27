const { Group } = require('../models/Group'); 

const createGroup = async (adminId, groupName, memberIds, groupImage = null) => {
  try {
   
    const newGroup = new Group({
      name: groupName,  
      admin: adminId,   
      members: memberIds,  
      groupImage: groupImage  
    });


    await newGroup.save();

    return newGroup;
  } catch (error) {
    console.error('Error creating group:', error);  
    throw new Error('Error creating group');  
  }
};


// Function to get a group by ID

const getGroupById = async (groupId) =>{
    try{
        const group = await Group.findById(groupId).populate('admin').populate('members');
        if(!group) throw new Error('Group not found');
        return group;

        
        
    }catch (error){

    }  console.error('Error fetching group by ID:', error);
    throw new Error('Error fetching group');
}

module.exports = { createGroup , getGroupById};  //
