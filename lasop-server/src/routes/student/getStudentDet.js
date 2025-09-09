const Student = require('../../models/student');

const getStudentDet = async (req, res) => {
    try {
        const studentId = req.params.id;
        const studentDetails = await Student.findById(studentId).populate('program.courseId')
            .populate('program.cohortId')
            .populate('program.center')
            .populate('program.tutorId');

        if (!studentId) {
            return res.status(404).json({
                message: 'Account not found'
            });
        };

        res.status(200).json(studentDetails);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = getStudentDet;