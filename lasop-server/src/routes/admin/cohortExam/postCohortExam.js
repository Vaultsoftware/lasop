const { getSocket } = require('../../../config/connection');
const CohortExam = require('../../../models/admin/cohortExam');

const postCohortExam = async (req, res) => {
    const { cohortId, examId, isActive, activatedAt } = req.body;

    try {
        const newCohortExam = await CohortExam.create({
            cohortId, examId, isActive, activatedAt
        });

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('newCohortExam', newCohortExam);
        }
        res.status(201).json({
            message: 'CohortExam created successfully',
            data: newCohortExam
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = postCohortExam;