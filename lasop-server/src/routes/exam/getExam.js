const Exam = require("../../models/exam");

const getExam = async (req, res) => {
    try {
        const exam = await Exam.find().populate('courseId');

        if (!exam || exam.length === 0) {
            return res.status(404).json({ message: 'No exams found' });
        }

        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getExam;