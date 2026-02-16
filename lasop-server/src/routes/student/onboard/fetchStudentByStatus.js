const mongoose = require("mongoose");
const Student = require("../../../models/student/student");

const fetchStudentByStatus = async (req, res) => {
    try {
        const { status, cohortId, courseId } = req.params;

        const filter = {};

        // status filter
        if (status) {
            filter.status = status;
        }

        // cohort filter
        if (cohortId && mongoose.Types.ObjectId.isValid(cohortId)) {
            filter["program.cohortId"] = cohortId;
        }

        // course filter
        if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
            filter["program.courseId"] = courseId;
        }

        const students = await Student.find(filter)
            .populate("program.courseId")
            .populate("program.cohortId")
            .populate("program.center");

        return res.status(200).json({
            message: 'Fetched successfully',
            data: students,
        });

    } catch (err) {
        console.error("fetchStudentByStatus error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error fetching students",
        });
    }
};

module.exports = fetchStudentByStatus;
