const Cohort = require('../../models/cohort');

const updateCohort = async (req, res) => {
    const { id } = req.params
    const { ...otherField } = req.body;

    try {
        const updatedCohort = await Cohort.findByIdAndUpdate(
            id,
            { ...otherField },
            { new: true, runValidators: true }
        );

        if(!updatedCohort) {
            return res.status(404).json({
                message: 'Cohort not found'
            })
        };

        res.status(200).json({
            message: 'Cohort updated successfully',
            data: updatedCohort
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = updateCohort;