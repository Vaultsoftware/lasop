const { getSocket } = require('../../../config/connection');
const Classroom = require('../../../models/staff/classroom');

const updateClassroomStatus = async (req, res) => {
    try {
        const now = new Date().getTime();

        const result = await Classroom.updateMany(
            {
                status: { $in: ['next', 'rescheduled'] },
                time: { $lt: now }
            },
            { $set: { status: 'missed' } }
        )
        
        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('classroomStatusUpdated', result);
        }

        res.status(200).json({ 
            message: 'Classroom status updated successfully', 
            modifiedCount: result.modifiedCount 
        });
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}