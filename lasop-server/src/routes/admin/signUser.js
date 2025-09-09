const User = require('../../models/user');
const bcrypt = require('bcrypt');

const signUser = async (req, res) => {
    const { name, email, contact, role, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name,
            email: email,
            contact: contact,
            role: role,
            password: hashPwd
        });

        const saveUser = await newUser.save();

        res.status(201).json({
            message: 'Account created successfully',
            data: saveUser
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = signUser;