const Course = require('../../models/course');

const getCourse = async (req, res) => {
    try {
        const course = await Course.find().populate('exams');
        
        if (!course || course.length === 0) {
            return res.status(404).json({ message: 'No courses found' });
        }

        res.status(201).json(course)
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getCourse;