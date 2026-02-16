const { getSocket } = require('../../../config/connection');
const Classroom = require('../../../models/staff/classroom');

const updateClassroom = async (req, res) => {
    const { id } = req.params;
    const { ...otherFields } = req.body;

    try {
        const classData = await Classroom.findByIdAndUpdate(id, { ...otherFields }, { new: true, runValidators: true });

        if(!classData) {
            return res.status(404).json({
                message: 'Classroom not found'
            })
        }

        const io = getSocket();
        if(io) {
            io.emit('updateClassroom', classData)
        };
        
        res.status(200).json({
            message: 'Classroom updated successfully',
            data: classData
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = updateClassroom;