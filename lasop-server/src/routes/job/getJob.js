const Job = require('../../models/job');

const getJob = async (req, res) => {
    try {
        const job = await Job.find();

        res.status(200).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = getJob;