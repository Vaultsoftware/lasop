const { getSocket } = require('../../../config/connection');
const Assessment = require('../../../models/staff/assessments');

const delAssessment = async (req, res) => {
    const { id } = req.params
    try {
        const assessmentId = await Assessment.findByIdAndDelete(id);

        if(!assessmentId) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        const io = getSocket();
        if(io) {
            io.to('lasop_global_room').emit('deleteAssessment', assessmentId)
        }
        
        res.status(200).json({
            message: 'Assessment deleted successfully',
            data: assessmentId
        });
    } catch (error) {
        res.status(400).json({ error: error.message, });
        console.log(error)
    };
}

module.exports = delAssessment;