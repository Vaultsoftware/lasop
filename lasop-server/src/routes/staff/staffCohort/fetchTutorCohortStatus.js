const Cohort = require('../../../models/admin/cohort');
const Staff = require('../../../models/staff/staff');

const fetchTutorCohortStatus = async (req, res) => {
    const { staffId, status } = req.params;
    if (!staffId || !status) {
        return res.status(404).json({
            message: 'Staff Id and Status are required'
        })
    }

    const allowedStatus = ["completed", "current", "inactive"];
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            message: `Status must be one of: ${allowedStatus.join(", ")}`,
        });
    }

    try {
        const staffExist = await Staff.findById(staffId);
        if (!staffExist) {
            return res.status(400).json({
                message: 'Staff doesnt exist'
            })
        };

        const cohorts = await Cohort.find({
            status,
            "courseTutors.tutors": staffId,
        })
            .populate("courseId")
            .populate("center")
            .populate("courseTutors.course")
            .populate("courseTutors.center")
            .populate("courseTutors.tutors");

        if (!cohorts || cohorts.length === 0) {
            return res.status(404).json({
                message: "No cohorts found for this tutor with that status",
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
                status: cohort.status,
                startDate: cohort.startDate,
                endDate: cohort.endDate,
                center: cohort.center,
                mode: cohort.mode,
                isActive: cohort.isActive,
                tutorCourses,
            };
        });

        return res.status(200).json({
            message: "Tutor cohorts by status fetched successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = fetchTutorCohortStatus;