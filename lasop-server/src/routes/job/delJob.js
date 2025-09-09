const Job = require('../../models/job');

const delJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findByIdAndDelete(jobId);

        if (!job) {
            return res.status(404).json({
                message: 'Job not found'
            });
        };

        res.status(200).json({
            message: 'Job deleted successfully',
            job
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = delJob;