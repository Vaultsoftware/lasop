const User = require('../../../models/cross/user');

const logAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email, password, role: 'admin' });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials or not an admin.' });
        }

        res.status(200).json({ message: 'Admin logged in successfully.', data: user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.', error });
    }
}

module.exports = logAdmin;