const Classroom = require('../../models/classroom');

const postAttendance = async (req, res) => {
    const { id } = req.params;
    const attendanceData = req.body;

    try {
        const markedAttendance = await Classroom.findByIdAndUpdate(
            id,
            {$push: { attendance: attendanceData }},
            { new: true, runValidators: true }
        );

        if(!markedAttendance) {
            return res.status(404).json({
                message: 'Classroom not found'
            })
        };

        res.status(200).json({
            message: 'Attendance marked successfully',
            data: markedAttendance
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = postAttendance