const Message = require("../../../models/cross/message");
const User = require("../../../models/cross/user");
const Staff = require("../../../models/staff/staff");
const Student = require("../../../models/student/student");
const mongoose = require("mongoose");

const MODEL_MAP = {
  User,
  Staff,
  Student,
};

const fetchAllConversations = async (req, res) => {
  const { senderId, senderModel } = req.query;

  if (!senderId || !senderModel) {
    return res.status(400).json({ message: "senderId and senderModel are required" });
  }

  try {
    // Aggregate to find unique conversation partners and their latest messages
    const meId = new mongoose.Types.ObjectId(senderId);

    const chatList = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: meId }, { receiver: meId }],
        },
      },
      {
        $addFields: {
          otherUser: {
            $cond: [
              { $eq: ["$sender", meId] },
              "$receiver",
              "$sender",
            ],
          },
          otherModel: {
            $cond: [
              { $eq: ["$sender", meId] },
              "$receiverModel",
              "$senderModel",
            ],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            otherUser: "$otherUser",
            otherModel: "$otherModel",
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", meId] },
                    { $eq: ["$seen", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);
    const populatedChats = await Promise.all(
      chatList.map(async (conv) => {
        const Model = MODEL_MAP[conv._id.otherModel];
        if (!Model) return null;
        const otherUser = await Model.findById(conv._id.otherUser);
        if (!otherUser) return null;
        return {
          conversationWith: {
            _id: otherUser._id,
            name:
              otherUser.name ||
              `${otherUser.firstName || otherUser.fName || ""} ${otherUser.lastName || otherUser.lName || ""
                }`.trim(),
            email: otherUser.email || null,
          },
          lastMessage: {
            _id: conv.lastMessage._id,
            sender: conv.lastMessage.sender,
            receiver: conv.lastMessage.receiver,
            messageType: conv.lastMessage.messageType,
            message: conv.lastMessage.message,
            createdAt: conv.lastMessage.createdAt,
            seen: conv.lastMessage.seen,
            seenAt: conv.lastMessage.seenAt || null,
          },
          unreadCount: conv.unreadCount,
        };
      })
    );
    const validChats = populatedChats.filter(Boolean);
    return res.status(200).json({
      message: "Chat list fetched successfully",
      data: validChats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = fetchAllConversations;