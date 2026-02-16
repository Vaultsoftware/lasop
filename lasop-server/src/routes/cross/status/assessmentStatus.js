const { getSocket } = require('../../../config/connection');
const Assessment = require('../../../models/staff/assessments');

const updateAssessmentStatus = async (req, res) => {
    try {
        const now = new Date();

        const result = await Assessment.updateMany(
            {
                status: { $in: ['active'] },
                dueDate: { $lt: now }
            },
            { $set: { status: 'inactive' } }
        );

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('assessmentStatusUpdated', result);
        }

        res.status(200).json({ 
            message: 'Assessment status updated successfully', 
            modifiedCount: result.modifiedCount 
        });
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = updateAssessmentStatus;