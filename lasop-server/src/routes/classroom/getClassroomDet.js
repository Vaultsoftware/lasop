const Classroom = require("../../models/classroom");

const getClassroomDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const classData = await Classroom.findById(id).populate('cohortId').populate('courseId').populate('center').populate('tutorId');

        if(!classData) {
            return res.status(404).json({
                message: "Classroom not found"
            })
        }

        res.status(200).json(classData)
    } catch (error) {
        res.status(400).json({ error: error.message, });
        console.log(error)
    };
};

module.exports = getClassroomDetail;