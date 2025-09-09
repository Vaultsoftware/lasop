const Project = require('../../models/projects');

const updateProjectStatus = async (req, res) => {
    try {
        const now = new Date();

        const result = await Project.updateMany(
            {
                status: { $in: ['active'] },
                dueDate: { $lt: now }
            },
            { $set: { status: 'inactive' } }
        );

        res.status(200).json({ 
            message: 'Project status updated successfully', 
            modifiedCount: result.modifiedCount 
        });
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = updateProjectStatus;