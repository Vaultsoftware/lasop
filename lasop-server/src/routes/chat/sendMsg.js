const mongoose = require('mongoose');
const Message = require('../../models/message');

const sendMsg = async (req, res) => {
    const { senderId, senderModel, recieverId, recieverModel, message } = req.body;

    try {
        const sender = await mongoose.model(senderModel).findById(senderId);
        const reciever = await mongoose.model(recieverModel).findById(recieverId);

        if(!sender || !reciever) {
            return res.status(400).json({ error: 'Sender or Receiver not found' });
        };

        const newChat = new Chat({
            sender: senderId,
            senderModel: senderModel,
            reciever: recieverId,
            recieverModel: recieverModel,
            message: message,
        });

        const savedChat = await newChat.save();
        res.status(200).json({
            message: 'Message sent successfully',
            data: savedChat,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
}

module.exports = sendMsg;