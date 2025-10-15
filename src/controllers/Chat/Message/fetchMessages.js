const { Message } = require('../../../models/Message');

const fetchMessages = async (req, res) => {
  try {
    const { userIds } = req.params; // Get the userIds from URL
    const ids = userIds.split(','); // Split the comma-separated IDs into an array
    const groupId = req.query.groupId;  // If groupId is provided, fetch group messages
    const lastMessageId = req.query.lastMessageId;  // last message ID from the frontend
    const lastTimestamp = req.query.lastTimestamp;  // last timestamp from the frontend

    // Check if at least two user IDs or a groupId is provided
    if ((ids.length < 2) && !groupId) {
      return res.status(400).json({
        success: false,
        message: 'At least two user IDs or a groupId is required to fetch messages.',
      });
    }

    // If it's a group chat, we fetch messages for that groupId
    let query;
    if (groupId) {
      query = Message.find({ groupId }).sort({ createdAt: 1 });
    } else {
      // Otherwise, fetch messages between the users (one-to-one chat)
      const orConditions = [];

      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          orConditions.push({
            $or: [
              { sender: ids[i], receiver: ids[j] },
              { sender: ids[j], receiver: ids[i] },
            ],
          });
        }
      }

      query = Message.find({ $or: orConditions }).sort({ createdAt: 1 });
    }

    // Apply pagination based on lastMessageId or lastTimestamp
    if (lastMessageId) {
      query = query.where('_id').gt(lastMessageId); // Fetch messages with ID greater than lastMessageId
    } else if (lastTimestamp) {
      query = query.where('createdAt').gt(new Date(lastTimestamp)); // Fetch messages created after lastTimestamp
    }

    // Limit the number of messages returned (pagination)
    query = query.limit(50);  // Adjust the limit as needed

    // Execute the query to fetch messages
    const messages = await query;

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { fetchMessages };
