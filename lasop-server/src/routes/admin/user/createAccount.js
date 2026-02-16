const User = require('../../../models/cross/user');

const createAccount = async (req, res) => {
    const { name, contact, role, password, email } = req.body;

    if (!name || !contact || !role || !password || !email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const newUser = new User({
            name,
            contact,
            role,
            password,
            email
        });

        await newUser.save();
        res.status(201).json({ message: 'Account created successfully.', data: newUser });

    } catch (error) {
        res.status(500).json({ message: 'Error creating account.', error });
    }
}
module.exports = createAccount;