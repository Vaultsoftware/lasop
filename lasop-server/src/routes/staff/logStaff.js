const comparePwd = require('../../middleware/comparePwd');
const generateToken = require('../../middleware/generateToken');
const Staff = require('../../models/staff');

const logStaff = async (req, res) => {
    const { email, password } = req.body;

    try {
        const staff = await Staff.findOne({ email });
        if(!staff) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const validPwd = await comparePwd({ email, password }, Staff);
        if(!validPwd) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(staff)
        res.status(200).json({ message: "Login Successful", data: staff, token: token });
    } catch (error) {
        res.status(400).json({ error: error.message, });
      };
};

module.exports = logStaff;