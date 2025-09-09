const Course = require('../../models/course');

const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { ...otherCourse } = req.body;

    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            id, 
            {
                ...otherCourse
            },
            { new: true, runValidators: true }
        );

        if(!updatedCourse) {
            return res.status(404).json({
                message: 'Course not found'
            })
        };

        res.status(200).json({
            message: 'Course updated successfully',
            data: updatedCourse
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = updateCourse;