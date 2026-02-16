const { getSocket } = require('../../../config/connection');
const Student = require('../../../models/student/student');
const bcrypt = require('bcrypt');

const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { password, ...otherFields } = req.body;

    try {
        if (password) {
            const salt = await bcrypt.genSalt(10);
            otherFields.password = await bcrypt.hash(password, salt);
        }

        const updatedStudent = await Student.findByIdAndUpdate(id,
            {
                ...otherFields,
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        };

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('updateStudent', updatedStudent);
            io.to(id.toString()).emit('updateStudent', updatedStudent);
        };

        res.status(200).json({
            message: 'Profile updated successfully',
            data: updatedStudent
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
}

module.exports = updateStudent;