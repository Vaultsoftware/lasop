const comparePwd = require('../../middleware/comparePwd');
const generateToken = require('../../middleware/generateToken');
const User = require('../../models/user');

const logUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await User.findOne({ email });
        if(!admin) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const validPwd = await comparePwd({ email, password }, User);
        if(!validPwd) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(admin)
        res.status(200).json({ message: "Login Successful", data: admin, token: token });
    } catch (error) {
        res.status(400).json({ error: error.message, });
      };
};

module.exports = logUser;