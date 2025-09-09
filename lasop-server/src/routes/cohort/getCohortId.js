const Cohort = require('../../models/cohort');

const getCohortDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const cohortId = await Cohort.findById(id).populate('courseId').populate('center').populate('courseTutors.course').populate('courseTutors.center').populate('courseTutors.tutors');

        if(!cohortId) {
            return res.status(404).json({
                message: 'Cohort not found'
            });
        } else {
            res.status(200).json(cohortId);
        };
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getCohortDetails