const Exam = require('../../models/exam');

const delExam = async (req, res) => {
    try {
        const { id } = req.params;

        const delExamId = await Exam.findByIdAndDelete(id);
        if (!delExamId) {
            return res.status(404).json({
                message: 'Exam not found'
            });
        }
        res.status(200).json({
            message: 'Exam deleted successfully',
            data: delExamId
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = delExam;