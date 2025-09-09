const Cohort = require('../../models/cohort');

const updateCohortStatus = async (req, res) => {
    try {
        const now = new Date();

        const result = await Cohort.updateMany(
            {
                status: { $in: ['inactive', 'current'] },
                endDate: { $lt: now }
            },
            { $set: { status: 'completed' } }
        );

        res.status(200).json({ 
            message: 'Cohort status updated successfully', 
            modifiedCount: result.modifiedCount 
        });
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = updateCohortStatus;