const { getSocket } = require('../../../config/connection');
const Job = require('../../../models/admin/job');

const delJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findByIdAndDelete(jobId);

        if (!job) {
            return res.status(404).json({
                message: 'Job not found'
            });
        };

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('jobDeleted', job);
        }

        res.status(200).json({
            message: 'Job deleted successfully',
            job
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = delJob;