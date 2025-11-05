const { Message } = require('../../../models/Message');

const fetchMessages = async (req, res) => {
  try {
    const { id:chatId } = req.params;  // fetch by chat
    const { lastMessageId, lastTimestamp } = req.query;

    if (!chatId) {
      return res.status(400).json({ success: false, message: 'chatId is required' });
    }

    // Construct the query
    let query = Message.find({ chatId }).sort({ createdAt: 1 }).populate('sender', 'username profilePic').lean();

    // Apply pagination if lastMessageId or lastTimestamp is provided
    if (lastMessageId) {
      query = query.where('_id').gt(lastMessageId);  // Get messages after lastMessageId
    } else if (lastTimestamp) {
      query = query.where('createdAt').gt(new Date(lastTimestamp));  // Get messages after lastTimestamp
    }

    const messages = await query.limit(50); // Limit the number of messages

    // If no messages found, return an empty array
    if (messages.length === 0) {
      return res.status(200).json({ success: true, messages: [] });
    }

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { fetchMessages };
