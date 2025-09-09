const Classroom = require('../../models/classroom');

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
        
        res.status(200).json({ 
            message: 'Classroom status updated successfully', 
            modifiedCount: result.modifiedCount 
        });
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}