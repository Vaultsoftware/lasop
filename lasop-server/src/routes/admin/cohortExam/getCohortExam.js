const CohortExam = require('../../../models/admin/cohortExam');

const getCohortExam = async (req, res) => {
	try {
		const data = await CohortExam.find().populate('cohortId').populate('examId');
		return res.status(200).json(data);
	} catch (err) {
		console.error('getCohortExam error:', err);
		return res.status(400).json({ error: err?.message || 'Failed to fetch cohort exams' });
	}
};

module.exports = getCohortExam;
