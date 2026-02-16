const { getSocket } = require('../../../config/connection');
const User = require('../../../models/cross/user');
const bcrypt = require('bcrypt');

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { password, ...otherField } = req.body;

    if (!id) {
        return res.status(400).json({
            message: 'Id is required to update account'
        })
    }

    try {
        if (password) {
            const salt = await bcrypt.genSalt(10);
            otherField.password = bcrypt.hashPassword(password, salt);
        };

        // Check if id correspond to a valid admin
        const adminId = await User.findById(id);
        if (!adminId) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { ...otherField },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: 'Account not found'
            });
        };

        const io = getSocket();
        if (io) {
            io.to(id).emit('accountUpdated', updatedUser );
        }

        return res.status(200).json({
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = updateUser;