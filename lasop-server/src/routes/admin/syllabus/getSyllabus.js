const Syllabus = require('../../../models/admin/syllabus');

const getSyllabus = async (req, res) => {
    try {
        const syllabus = await Syllabus.find();

        res.status(200).json(syllabus);
    } catch (error) {
        res.status(400).json({ error: error.message, });
      };
};

module.exports = getSyllabus;