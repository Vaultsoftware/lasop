const { getSocket } = require("../../../config/connection");
const CohortChat = require("../../../models/cross/cohortChat");

const postCohortMessage = async (req, res) => {
  const { cohortId, messageType, message, fileUrl } = req.body;
  const { userId: sender, role: senderModel } = req.user;

  if (!cohortId || !messageType) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newMessage = await CohortChat.create({
      cohortId,
      sender,
      senderModel,
      messageType,
      message,
      fileUrl,
      seenBy: [sender],
    });

    const io = getSocket();
    if (io) {
      io.to(cohortId.toString()).emit('new_cohort_msg', newMessage)
    }

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = postCohortMessage;
