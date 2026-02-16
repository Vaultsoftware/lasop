const { getSocket } = require('../../../config/connection');
const Exam = require('../../../models/admin/exam');

const delExam = async (req, res) => {
    try {
        const { id } = req.params;

        const delExamId = await Exam.findByIdAndDelete(id);
        if (!delExamId) {
            return res.status(404).json({
                message: 'Exam not found'
            });
        }
        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('examDeleted', delExamId);
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