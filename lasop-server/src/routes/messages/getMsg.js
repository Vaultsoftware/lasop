const Message = require("../../models/message");

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('sender')
            .populate('reciever');
        
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = getMessages;
