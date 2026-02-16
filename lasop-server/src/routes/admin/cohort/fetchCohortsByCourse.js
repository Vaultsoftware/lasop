const Cohort = require('../../../models/admin/cohort');

const fetchCohortsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({
                message: 'courseId is required',
            });
        }

        const cohorts = await Cohort.find({
            courseId: { $in: [courseId] }
        })
            .populate('courseId')
            .populate('center');

        return res.status(200).json({
            message: 'Fetched successfully',
            data: cohorts,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch cohorts',
        });
    }
};

module.exports = fetchCohortsByCourse;
