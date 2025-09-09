const Cohort = require('../../models/cohort');

const getCohort = async (req, res) => {
    try {
        const cohorts = await Cohort.find().populate('courseId').populate('center').populate('courseTutors.course').populate('courseTutors.center').populate('courseTutors.tutors');

        if (!cohorts || cohorts.length === 0) {
            return res.status(404).json({ message: 'No cohorts found' });
        }

        res.status(201).json(cohorts)
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getCohort;