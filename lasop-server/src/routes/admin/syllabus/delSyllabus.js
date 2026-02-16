const { getSocket } = require('../../../config/connection');
const Syllabus = require('../../../models/admin/syllabus');

const delSyllabus = async (req, res) => {
    try {
        const syllabusId = req.params.id;
        const syllabus = await Syllabus.findByIdAndDelete(syllabusId);

        if(!syllabusId) {
            return res.status(404).json({
                message: 'Syllabus not found'
            });
        };

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('syllabusDeleted', syllabus);
        }

        res.status(200).json({
            message: 'Syllabus deleted successfully',
            syllabus
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = delSyllabus;