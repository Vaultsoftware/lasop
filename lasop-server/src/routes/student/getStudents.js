const Student = require('../../models/student');

const getStudent = async (req, res) => {
    try {
        const students = await Student.find().populate('program.courseId').populate('program.cohortId').populate('program.center').populate('program.tutorId');
            
        if (!students) {
            return res.status(404).json({
                message: 'No student found'
            });
        };

        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = getStudent;