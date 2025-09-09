const Student = require('../../models/student');

const addCourseStudent = async (req, res) => {
    const { id } = req.params;
    const { cohortId } = req.body;

    try {
        const updatedCourse = await Student.findByIdAndUpdate(
            id,
            {
                $push: {
                    cohortId: cohortId
                }
            }, {
                new: true
            }
        );

        if(!updatedCourse) {
            return res.status(404).json({ message: 'Student not found' });
        };

        res.status(200).json({
            message: 'Course purchased successfully',
            data: updatedCourse,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = addCourseStudent;