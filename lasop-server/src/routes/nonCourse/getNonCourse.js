const NonCourse = require("../../models/nonCourse");

const getNonCourse = async (req, res) => {
    try {
        const course = await NonCourse.find();

        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = getNonCourse;