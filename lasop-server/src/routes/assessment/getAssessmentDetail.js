const Assessment = require('../../models/assessments');

const getAssessmentDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const assessmentId = await Assessment.findById(id).populate('cohortId').populate('courseId').populate('submission.studentId').populate('tutorId').populate('center');

        if(!assessmentId) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        res.status(200).json(assessmentId);
    } catch (error) {
        res.status(400).json({ error: error.message, });
        console.log(error)
    };
};

module.exports = getAssessmentDetail;