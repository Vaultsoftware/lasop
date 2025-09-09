const Assessment = require('../../models/assessments');

const postSubmissionAss = async (req, res) => {
    const { assessmentId } = req.params;
    const { studentId, answer } = req.body;

    try {
        const assessment = await Assessment.findById(assessmentId);

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        let submissionIndex = assessment.submission.findIndex((sub) => sub.studentId.toString() === studentId);
        let newSubmission;

        if (submissionIndex === -1) {
            newSubmission = {
                studentId,
                answer,
                submitted: true,
                submissionDate: new Date(),
                status: 'ungraded'
            };
            assessment.submission.push(newSubmission);
        } else {
            const existingSubmission = assessment.submission[submissionIndex];

            if (existingSubmission.submitted) {
                return res.status(400).json({ message: 'Student has already submitted an answer' });
            }

            newSubmission = {
                ...existingSubmission.toObject(), // Ensure it's a plain object
                answer,
                submitted: true,
                submissionDate: new Date(),
                status: 'ungraded'
            };
            assessment.submission[submissionIndex] = newSubmission;
        }

        await assessment.save();

        res.status(200).json({
            message: 'Submission successful',
            data: assessment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = postSubmissionAss;
