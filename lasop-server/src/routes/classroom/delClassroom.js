const Classroom = require("../../models/classroom");

const delClassroom = async (req, res) => {
    const { id } = req.params;

    try {
        const classroomData = await Classroom.findByIdAndDelete(id);

        if (!classroomData) {
            return res.status(404).json({
                message: 'classroom not found'
            })
        }

        res.status(200).json({
            message: 'Classroom deleted successfully',
            data: classroomData
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = delClassroom;