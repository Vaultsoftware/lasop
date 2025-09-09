const Course = require('../../models/course');

const getCourseDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const CourseId = await Course.findById(id).populate('exams');

        if(!CourseId) {
            return res.status(404).json({
                message: 'Course not found'
            });
        } else {
            res.status(200).json(CourseId);
        };
    } catch (error) {
        res.status(400).json({ error: error.message, });
        console.log(error)
    };
};

module.exports = getCourseDetails