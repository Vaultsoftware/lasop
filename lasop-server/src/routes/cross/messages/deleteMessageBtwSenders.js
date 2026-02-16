const { getSocket } = require("../../../config/connection");
const Message = require("../../../models/cross/message");

const deleteMessageBtwSenders = async (req, res) => {
  const { messageId, otherUserId } = req.params;

  const senderId = req.user.id;

  if (!messageId || !otherUserId) {
    return res.status(400).json({
      message: "messageId and otherUserId are required",
    });
  }

  try {
    const message = await Message.findOneAndDelete({
      _id: messageId,
      $or: [
        { sender: senderId, receiver: otherUserId },
        { sender: otherUserId, receiver: senderId },
      ],
    });

    if (!message) {
      return res.status(404).json({
        message: "Message not found or not authorized",
      });
    }

    const chatRoom = [senderId, otherUserId].sort().join("_");

    const io = getSocket();
    if (io) {
      io.to(`chat_${chatRoom}`).emit("message_deleted", {
        messageId,
        deletedBy: senderId,
      });
    }

    res.status(200).json({
      message: "Message deleted successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteMessageBtwSenders;
