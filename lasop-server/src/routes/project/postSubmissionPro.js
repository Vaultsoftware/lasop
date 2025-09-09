const Project = require('../../models/projects');

const postSubmissionPro = async (req, res) => {
    const { projectId } = req.params;
    const { studentId, answer } = req.body;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'project not found' });
        }

        const submissionIndex = project.submission.findIndex((sub) => sub.studentId.toString() === studentId)

        if (submissionIndex === -1) {
            newSubmission = {
                studentId,
                answer,
                submitted: true,
                submissionDate: new Date(),
                status: 'ungraded'
            };
            project.submission.push(newSubmission)
        }
        else {
            const existingSubmission = project.submission[submissionIndex];

            if (existingSubmission.submitted) {
                return res.status(400).json({ message: 'Student has already submitted an answer' });
            }
            newSubmission = {
                ...existingSubmission.toObject(),
                answer,
                submitted: true,
                submissionDate: new Date(),
                status: 'ungraded'
            };
            project.submission[submissionIndex] = newSubmission;
        }

        await project.save();
        res.status(200).json({ message: 'Submission successful', data: project});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = postSubmissionPro;