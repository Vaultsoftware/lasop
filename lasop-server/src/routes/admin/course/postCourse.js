const { getSocket } = require('../../../config/connection');
const Course = require('../../../models/admin/course');

const postCourse = async (req, res) => {
    const { title, code, price, exams = [] } = req.body;

    try {
        const courseExist = await Course.findOne({ title });
        if (courseExist) {
            return res.status(400).json({
                message: 'Course already exist'
            });
        }
        else {
            const newCourse = await Course.create({
                title, code, price, exams
            });

            const io = getSocket();
            if (io) {
                io.to('lasop_global_room').emit('newCourse', newCourse);
            }
            
            res.status(201).json({
                message: 'Course created successfully',
                data: newCourse
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = postCourse;