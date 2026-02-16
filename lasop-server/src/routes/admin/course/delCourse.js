const { getSocket } = require('../../../config/connection');
const Course = require('../../../models/admin/course');

const delCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const delCourseId = await Course.findByIdAndDelete(id);
        if (!delCourseId) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('courseDeleted', delCourseId);
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