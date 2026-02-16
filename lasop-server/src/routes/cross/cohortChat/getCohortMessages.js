const CohortChat = require("../../../models/cross/cohortChat");

const getCohortMessages = async (req, res) => {
  const { cohortId } = req.params;

  try {
    const messages = await CohortChat.find({ cohortId })
      .sort({ createdAt: 1 })
      .populate("sender", "name");

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = getCohortMessages;