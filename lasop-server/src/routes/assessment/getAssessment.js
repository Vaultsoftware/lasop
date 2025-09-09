const Assessment = require('../../models/assessments');

const getAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.find().populate('cohortId').populate('courseId').populate('submission.studentId').populate('tutorId').populate('center');
        
        // if (!assessment || assessment.length === 0) {
            // // return res.status(404).json({ message: 'No assessment found' });
        // }

        res.status(201).json(assessment)
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = getAssessment