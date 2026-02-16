const Staff = require("../../../models/staff/staff");
const Student = require("../../../models/student/student");

const fetchAllStudentsUnderTutorCohort = async (req, res) => {
  const { staffId } = req.params;

  if (!staffId) {
    return res.status(400).json({
      message: "staffId is required",
    });
  }

  try {
    // 1) ensure tutor exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    // 2) fetch students assigned to this tutor
    const students = await Student.find({
      "program.tutorId": staffId,
    })
      .populate("program.courseId", "name title")
      .populate("program.cohortId", "cohortName status startDate endDate")
      .populate("program.center", "name location")
      .populate("program.tutorId", "firstName lastName email");

    if (!students || students.length === 0) {
      return res.status(404).json({
        message: "No students assigned to this tutor",
      });
    }

    const groupedByCohort = {};

    students.forEach((student) => {
      const cohortId = student.program.cohortId?._id?.toString() || "unassigned";

      if (!groupedByCohort[cohortId]) {
        groupedByCohort[cohortId] = {
          cohort: student.program.cohortId || null,
          students: [],
        };
      }

      groupedByCohort[cohortId].students.push({
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        contact: student.contact,
        gender: student.gender,
        status: student.status,
        program: student.program,
      });
    });

    return res.status(200).json({
      message: "Students under tutor fetched successfully",
      count: students.length,
      cohorts: groupedByCohort,
    });
  } catch (error) {
    console.error("Error fetching tutor students:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = fetchAllStudentsUnderTutorCohort;