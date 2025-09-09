const Project = require('../../models/projects');

const delProject = async (req, res) => {
    const { id } = req.params
    try {
        const projectId = await Project.findByIdAndDelete(id);

        if(!projectId) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({
            message: 'Project deleted successfully',
            data: projectId
        });
    } catch (error) {
        res.status(400).json({ error: error.message, });
        console.log(error)
    };
}

module.exports = delProject;