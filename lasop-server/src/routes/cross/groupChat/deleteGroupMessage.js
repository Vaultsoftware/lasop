const { getSocket } = require("../../../config/connection");
const GroupChat = require("../../../models/cross/groupChat");

const deleteGroupMessage = async (req, res) => {
  const { messageId, groupId } = req.params;
  const { userId } = req.user;

  try {
    const message = await GroupChat.findOneAndDelete({
      _id: messageId,
      sender: userId,
    });

    if (!message) {
      return res
        .status(404)
        .json({ message: "Message not found or not authorized" });
    }

    const io = getSocket();
    if (io) {
      io.to(groupId.toString()).emit('msg_del_group', message)
    }

    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = deleteGroupMessage;
