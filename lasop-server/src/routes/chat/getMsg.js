const Message = require('../../models/message');

const getMsg = async (req, res) => {
    const { senderId, recieverId } = req.query;

    try {
        const msg = await Message.find({
            $or: [
                {
                    sender: senderId,
                    reciever: recieverId
                },
                {
                    sender: recieverId,
                    reciever: senderId
                }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({
            message: 'Messages retrieved successfully',
            data: msg,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = getMsg;