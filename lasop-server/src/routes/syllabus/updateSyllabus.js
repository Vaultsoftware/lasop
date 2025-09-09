const Syllabus = require('../../models/syllabus');

const updateSyllabus = async (req, res) => {
    const { id } = req.params;
    const { ...otherField } = req.body;

    try {
        const updatedSyllabus = await Syllabus.findByIdAndUpdate(
            id,
            { ...otherField },
            { new: true, runValidators: true }
        );

        if(!updatedSyllabus) {
            return res.status(404).json({
                message: 'Syllabus not found'
            });
        };

        res.status(200).json({
            message: 'Syllabus updated successfully',
            data: updatedSyllabus
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = updateSyllabus;