const { getSocket } = require("../../../config/connection");
const CohortChat = require("../../../models/cross/cohortChat");

const deleteCohortMessage = async (req, res) => {
  const { messageId, cohortId } = req.params;
  const { userId } = req.user;

  try {
    const message = await CohortChat.findOneAndDelete({
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
      io.to(cohortId.toString()).emit('msg_del_cohort', message)
    }

    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = deleteCohortMessage;
