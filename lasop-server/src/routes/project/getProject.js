const Project = require('../../models/projects');

const getProject = async (req, res) => {
    try {
        const project = await Project.find().populate('cohortId').populate('tutorId').populate('courseId').populate('submission.studentId').populate('center');
        
        // if (!project || project.length === 0) {
        //     return res.status(404).json({ message: 'No projects found' });
        // }

        res.status(201).json(project)
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = getProject