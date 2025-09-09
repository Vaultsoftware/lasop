const comparePwd = require('../../middleware/comparePwd');
const generateToken = require('../../middleware/generateToken');
const Student = require('../../models/student');

const logStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.findOne({ email });
        if(!student) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const validPwd = await comparePwd({ email, password }, Student);
        if(!validPwd) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(student)
        res.status(200).json({ message: "Login Successful", data: student, token: token });
    } catch (error) {
        res.status(400).json({ error: error.message, });
      };
};

module.exports = logStudent;