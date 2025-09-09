const Student = require('../../models/student');

const delStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findByIdAndDelete(studentId);

        if(!studentId) {
            return res.status(404).json({message: 'Account not found'});
        }
        res.status(200).json({message: 'Account deleted successfully', student});
    } catch (err) {
        res.status(500).json({error: err.message});
    };
};

module.exports = delStudent;