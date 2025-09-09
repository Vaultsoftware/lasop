const Student = require('../../models/student');

const convertProgramArrayToObject = async (req, res) => {
    try {
        const result = await Student.deleteMany({}); // Delete all documents
        res.status(200).json({
          message: `${result.deletedCount} student(s) deleted successfully.`,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};

module.exports = convertProgramArrayToObject;