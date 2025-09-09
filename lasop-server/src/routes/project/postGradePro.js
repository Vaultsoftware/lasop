const Project = require('../../models/projects');

const postGradePro = async (req, res) => {
    const { projectId, studentId } = req.params;
    const { grade, feedback } = req.body;

    try {
        const markStudent = await Project.findOneAndUpdate(
            {
                _id: projectId,
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
            return res.status(404).json({ message: 'Project or submission not found' });
        }

        res.status(200).json({ message: 'Feedback updated successfully', data: markStudent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = postGradePro;