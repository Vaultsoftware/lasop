const Project = require('../../models/projects');

const getProjectDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const projectId = await Project.findById(id).populate('cohortId').populate('courseId').populate('tutorId').populate('submission.studentId');

        if(!projectId) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(projectId);
    } catch (error) {
        res.status(400).json({ error: error.message, });
        console.log(error)
    };
};

module.exports = getProjectDetail;