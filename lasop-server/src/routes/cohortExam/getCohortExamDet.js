const CohortExam = require('../../models/cohortExam');

const getCohortExamDet = async (req, res) => {
    try {
        const { id } = req.params;

        const cohortExam = await CohortExam.findById(id).populate('cohortId').populate('examId');
        if (!cohortExam) {
            return res.status(404).json({
                message: 'CohortExam not found'
            });
        }

        res.status(200).json({
            message: 'CohortExam retrieved successfully',
            data: cohortExam
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = getCohortExamDet;