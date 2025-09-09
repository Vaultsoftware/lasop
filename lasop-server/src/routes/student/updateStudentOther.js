const Cohort = require('../../models/cohort');

const updateStudentWithoutOtherName = async (req, res) => {
    try {
        const inactiveCohorts = await Cohort.find({ isActive: true, status: 'inactive' });
        console.log('Before update:', inactiveCohorts.length);

        const resultEmpty = await Cohort.updateMany(
            { isActive: true, status: 'inactive' },
            { $set: { status: 'current' } }
        );
        console.log(`${resultEmpty.modifiedCount} cohorts updated to 'current'`);
    } catch (error) {
        console.error('Error updating cohorts:', error);
    }
}

module.exports = updateStudentWithoutOtherName