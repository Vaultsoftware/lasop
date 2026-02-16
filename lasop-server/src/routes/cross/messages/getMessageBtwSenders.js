const Message = require("../../../models/cross/message");
const User = require("../../../models/cross/user");
const Staff = require("../../../models/staff/staff");
const Student = require("../../../models/student/student");

const MODEL_MAP = {
  User,
  Staff,
  Student,
};

const getMessageBtwSenders = async (req, res) => {
  const { senderId, receiverId, senderModel, receiverModel} = req.params;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "senderId and receiverId are required" });
  }

  try {
    const SenderModel = MODEL_MAP[senderModel];
    const ReceiverModel = MODEL_MAP[receiverModel];

    if (!SenderModel || !ReceiverModel) {
      return res.status(400).json({ message: "Invalid sender/receiver model" });
    }

    const senderExists = await SenderModel.findById(senderId);
    const receiverExists = await ReceiverModel.findById(receiverId);

    if (!senderExists || !receiverExists) {
      return res.status(404).json({ message: "Account not found" });
    }

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender")
      .populate("receiver");

    res.status(200).json({
      message: 'Messages fetched successfully',
      data: messages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getMessageBtwSenders;
