const { getSocket } = require('../../../config/connection');
const Project = require('../../../models/student/projects');

const delProject = async (req, res) => {
    const { id } = req.params
    try {
        const projectId = await Project.findByIdAndDelete(id);

        if (!projectId) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('deletedProject', projectId);
            io.emit('deletedProject', projectId);
        };

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