const Staff = require('../../models/staff');
const bcrypt = require('bcrypt');

const postStaff = async (req, res) => {
    const { firstName, lastName, email, contact, address, dateOfEmploy, salary, password, otherInfo, role, enrol, status } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(password, salt);

        const staffExist = await Staff.findOne({ email });

        if (staffExist) {
            return res.status(400).json({ message: 'Email already exists' })
        } else {
            const newStaff = await Staff.create({
                firstName,
                lastName,
                email,
                contact,
                address,
                dateOfEmploy,
                salary,
                password: hashPwd,
                otherInfo,
                role,
                enrol,
                status
            });

            res.status(201).json({
                message: 'Account created successfully',
                data: newStaff,
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = postStaff;