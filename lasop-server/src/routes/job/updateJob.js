const Job = require('../../models/job');

const updateJob = async (req, res) => {
    const { id } = req.params;
    const { ...otherField } = req.body;

    try {
        const updatedJob = await Job.findByIdAndUpdate(
            id,
            { ...otherField },
            { new: true, runValidators: true }
        )

        if(!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        };

        res.status(200).json({ message: 'Job updated successfully', data: updatedJob });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = updateJob;