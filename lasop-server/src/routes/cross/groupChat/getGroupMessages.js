const GroupChat = require("../../../models/cross/groupChat");

const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await GroupChat.find({ groupId })
      .sort({ createdAt: 1 })
      .populate("sender");

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = getGroupMessages;
