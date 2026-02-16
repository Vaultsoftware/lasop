const { getSocket } = require('../../../config/connection');
const Exam = require('../../../models/admin/exam');

const updateExam = async (req, res) => {
    const { id } = req.params;
    const { ...otherExam } = req.body;

    try {
        const updatedExam = await Exam.findByIdAndUpdate(
            id, 
            {
                ...otherExam
            },
            { new: true, runValidators: true }
        );

        if(!updatedExam) {
            return res.status(404).json({
                message: 'Exam not found'
            })
        };

        const io = getSocket();
        if(io) {
            io.to('lasop_global_room').emit('examUpdated', updatedExam);
        }
        
        res.status(200).json({
            message: 'Exam updated successfully',
            data: updatedExam
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = updateExam;