const { getSocket } = require('../../../config/connection');
const User = require('../../../models/cross/user');
const bcrypt = require('bcrypt');

const signUser = async (req, res) => {
    const { name, email, contact, role, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(password, salt);

        const adminExist = await User.findOne({ email });
        if(adminExist) {
            return res.status(404).json({
                message: 'Admin exist already'
            })
        };

        const newUser = new User({
            name: name,
            email: email,
            contact: contact,
            role: role,
            password: hashPwd
        });

        const saveUser = await newUser.save();

        const io = getSocket();
        if(io) {
            io.to(saveUser._id.toString()).emit('accountCreated', saveUser);
        }

        return res.status(201).json({
            message: 'Account created successfully',
            data: saveUser
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = signUser;