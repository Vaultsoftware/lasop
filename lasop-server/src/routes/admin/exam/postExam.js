const { getSocket } = require("../../../config/connection");
const Exam = require("../../../models/admin/exam");

const postExam = async (req, res) => {
    const { title, code, status, duration, countdown, courseId } = req.body;
    
    try {
        const examExisted = await Exam.findOne({ title });

        if(examExisted) {
            return res.status(400).json({
                message: 'Exam already exists'
            });
        }
        else {
            const newExam = await Exam.create({
                title, code, status, duration, countdown, courseId
            });

            const io = getSocket();
            if (io) {
                io.to('lasop_global_room').emit('newExam', newExam);
            }
            
            return res.status(201).json({
                message: 'Exam successfully created',
                data: newExam
            });
        };
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = postExam;