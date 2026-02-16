const { getSocket } = require('../../../config/connection');
const Cohort = require('../../../models/admin/cohort');

const delCohort = async (req, res) => {
    try {
        const cohId = req.params.id;
        const cohort = await Cohort.findByIdAndDelete(cohId);

        if(cohId) {
            return res.status(404).json({
                message: 'Cohort not found'
            });
        };

        const io = getSocket();
        if(io) {
            io.to('lasop_global_room').emit('cohortDeleted', cohort);
        }

        res.status(200).json({
            message: 'Cohort deleted successfully',
            cohort
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = delCohort;