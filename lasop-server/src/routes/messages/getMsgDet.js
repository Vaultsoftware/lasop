const Message = require("../../models/message");

const getMessageDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findById(id)
            .populate({
                path: 'sender',
                model: req.senderModel,
            })
            .populate({
                path: 'reciever',
                model: req.receiverModel,
            });

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = getMessageDetail;
