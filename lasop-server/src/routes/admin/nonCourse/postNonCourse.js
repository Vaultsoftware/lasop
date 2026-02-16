const NonCourse = require("../../../models/admin/nonCourse");

const postNonCourse = async (req, res) => {
    const { title, code, price } = req.body;

    try {
        const courseExist = await NonCourse.findOne({ title });
        if (courseExist) {
            return res.status(400).json({
                message: 'Course already exist'
            });
        }
        else {
            const newCourse = await NonCourse.create({
                title, code, price
            });

            const io = getSocket();
            if (io) {
                io.to('lasop_global_room').emit('newNonCourse', newCourse);
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

module.exports = postNonCourse;