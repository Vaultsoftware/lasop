const Syllabus = require('../../models/syllabus');

const delSyllabus = async (req, res) => {
    try {
        const syllabusId = req.params.id;
        const syllabus = await Syllabus.findByIdAndDelete(syllabusId);

        if(!syllabusId) {
            return res.status(404).json({
                message: 'Syllabus not found'
            });
        };

        res.status(200).json({
            message: 'Syllabus deleted successfully',
            syllabus
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = delSyllabus;