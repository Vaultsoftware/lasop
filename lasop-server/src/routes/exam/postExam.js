const Exam = require("../../models/exam");

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