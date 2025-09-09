const Course = require('../../models/course');

const delCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const delCourseId = await Course.findByIdAndDelete(id);
        if (!delCourseId) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }
        res.status(200).json({
            message: 'Course deleted successfully',
            data: delCourseId
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = delCourse;