const Message = require("../../models/message");

const postMsg = async (req, res) => {
    const { sender, senderModel, reciever, recieverModel, message } = req.body;

    try {
        const newMessage = await Message.create({
            sender,
            senderModel,
            reciever,
            recieverModel,
            message,
        });

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = postMsg;
