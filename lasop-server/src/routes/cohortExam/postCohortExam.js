const CohortExam = require('../../models/cohortExam');

const postCohortExam = async (req, res) => {
    const { cohortId, examId, isActive, activatedAt } = req.body;

    try {
        const newCohortExam = await CohortExam.create({
            cohortId, examId, isActive, activatedAt
        });

        res.status(201).json({
            message: 'CohortExam created successfully',
            data: newCohortExam
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = postCohortExam;