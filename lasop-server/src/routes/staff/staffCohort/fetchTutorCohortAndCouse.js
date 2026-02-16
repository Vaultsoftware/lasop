const Cohort = require('../../../models/admin/cohort');
const Staff = require('../../../models/staff/staff');

const fetchTutorCohortAndCourse = async (req, res) => {
    const { staffId } = req.params;
    if (!staffId) {
        return res.status(404).json({
            message: 'Staff Id are required'
        })
    }

    try {
        const staffExist = await Staff.findById(staffId);
        if (!staffExist) {
            return res.status(400).json({
                message: 'Staff doesnt exist'
            })
        };

        const cohorts = await Cohort.find({
            "courseTutors.tutors": staffId,
        })
            .populate("courseId")
            .populate("center")
            .populate("courseTutors.course")
            .populate("courseTutors.center")
            .populate("courseTutors.tutors");

        if (!cohorts || cohorts.length === 0) {
            return res.status(404).json({
                message: "No cohorts assigned to this tutor",
            });
        }

        const result = cohorts.map((cohort) => {
            const tutorCourses = cohort.courseTutors.filter((ct) => {
                if (!ct.tutors) return false;

                return ct.tutors._id
                    ? ct.tutors._id.toString() === staffId
                    : ct.tutors.toString() === staffId;
            });

            return {
                _id: cohort._id,
                cohortName: cohort.cohortName,
                startDate: cohort.startDate,
                endDate: cohort.endDate,
                center: cohort.center,
                mode: cohort.mode,
                status: cohort.status,
                isActive: cohort.isActive,
                tutorCourses,
            };
        });

        return res.status(200).json({
            message: "Tutor cohorts fetched successfully",
            data: result,
        });

    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = fetchTutorCohortAndCourse