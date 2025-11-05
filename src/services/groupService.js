const { Group } = require("../models/Group");
const { Chat } = require("../models/Chat");

const createGroup = async (
  adminId,
  groupName,
  memberIds,
  groupImage = null
) => {
  try {
    if (!adminId) throw new Error("Admin ID is required");
    if (!groupName) throw new Error("Group name is required");
    if (!memberIds || memberIds.length < 1)
      throw new Error("At least one member is required");

    // ✅ Check if group already exists by name
    const existingGroup = await Group.findOne({ name: groupName });
    if (existingGroup) {
      return existingGroup;
    }

    // ✅ Step 1: Create the Group
    const newGroup = new Group({
      name: groupName,
      admin: adminId,
      members: [...new Set([adminId, ...memberIds])],
      groupImage: groupImage || null,
    });
    await newGroup.save();

    // ✅ Step 2: Create the linked group chat in Chat model
    const newChat = new Chat({
      users: [...new Set([adminId, ...memberIds])],
      type: "group",
      groupId: newGroup._id,
      groupName,
      groupImage,
    });
    await newChat.save();

    return { group: newGroup, chat: newChat };
  } catch (error) {
    console.error("Error creating group:", error);
    throw new Error(error.message || "Error creating group");
  }
};

// Get group by ID
const getGroupById = async (groupId) => {
  try {
    const group = await Group.findById(groupId)
      .populate("admin", "username email profilePic")
      .populate("members", "username email profilePic");
    if (!group) throw new Error("Group not found");
    return group;
  } catch (error) {
    console.error("Error fetching group by ID:", error);
    throw new Error("Error fetching group");
  }
};

// Get all groups for a user
const getGroupsByUserId = async (userId) => {
  try {
    const groups = await Group.find({ members: userId })
      .populate("admin", "username email profilePic")
      .populate("members", "username email profilePic");
    return groups;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    throw new Error("Error fetching user groups");
  }
};

module.exports = { createGroup, getGroupById, getGroupsByUserId };
