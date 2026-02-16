const { getSocket } = require("../../../config/connection");
const Message = require("../../../models/cross/message");
const User = require("../../../models/cross/user");
const Staff = require("../../../models/staff/staff");
const Student = require("../../../models/student/student");

const MODEL_MAP = {
  User,
  Staff,
  Student,
};

const postMsg = async (req, res) => {
  const {
    sender,
    senderModel,
    receiver,
    receiverModel,
    messageType,
    message,
  } = req.body;

  if (!receiver || !messageType) {
    return res.status(400).json({
      message: "receiver and messageType are required",
    });
  }

  // conditional validation
  if (messageType === "Text" && !message) {
    return res.status(400).json({
      message: "message is required for Text messages",
    });
  }

  try {
    const SenderModel = MODEL_MAP[senderModel];
    const ReceiverModel = MODEL_MAP[receiverModel];

    console.log(SenderModel, ReceiverModel)

    if (!SenderModel || !ReceiverModel) {
      console.log("Invalid sender or receiver model:", senderModel, receiverModel);
      return res.status(400).json({ message: "Invalid sender/receiver model" });
    }

    const senderExists = await SenderModel.findById(sender);
    const receiverExists = await ReceiverModel.findById(receiver);

    if (!senderExists || !receiverExists) {
      console.log("Sender or receiver does not exist:", sender, receiver);
      return res.status(404).json({ message: "Account not found" });
    }

    const newMessage = await Message.create({
      sender,
      senderModel,
      receiver,
      receiverModel,
      messageType,
      message,
    });

    const chatRoom = [sender, receiver].sort().join("_");

    const io = getSocket();
    if (io) {
      io.to(chatRoom).emit("new_message", newMessage);
    }

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = postMsg;
