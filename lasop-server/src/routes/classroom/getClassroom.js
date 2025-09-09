const Classroom = require("../../models/classroom");

const getClassroom = async (req, res) => {
    try {
        const classId = await Classroom.find().populate('cohortId').populate('courseId').populate('center').populate('tutorId').populate('attendance');
        if(!classId) {
            return res.status(404).json({
                message: 'Class not found'
            })
        }

        res.status(200).json(classId);
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getClassroom;