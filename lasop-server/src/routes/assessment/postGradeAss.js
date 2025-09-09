const Assessment = require('../../models/assessments');

const postGradeAss = async (req, res) => {
    const { assessmentId, studentId } = req.params;
    const { grade, feedback } = req.body;

    try {
        const markStudent = await Assessment.findOneAndUpdate(
            {
                _id: assessmentId,
                'submission.studentId': studentId
            },
            {
                $set: {
                    'submission.$.grade': grade,
                    'submission.$.feedback': feedback,
                    'submission.$.status': 'graded'
                }
            },
            { new: true, runValidators: true }
        )

        if (!markStudent) {
            return res.status(404).json({ message: 'Assessment or submission not found' });
        }

        res.status(200).json({ message: 'Feedback updated successfully', data: markStudent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = postGradeAss;