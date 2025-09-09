const User = require('../../models/user');
const bcrypt = require('bcrypt');

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { password, ...otherField } = req.body;

    try {
        if (password) {
            const salt = await bcrypt.genSalt(10);
            otherField.password = bcrypt.hashPassword(password, salt);
        };

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { ...otherField },
            { new: true, runValidators: true }
        );

        if(!updatedUser) {
            return res.status(404).json({
                message: 'Account not found'
            });
        };

        res.status(200).json({
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = updateUser;