const Certificate = require('../../../models/admin/certificate');
const { getSocket } = require('../../../config/connection')

const updateCert = async (req, res) => {
    const { id } = req.params;
    const { ...otherFields } = req.body;

    try {
        const certExist = await Certificate.findByIdAndUpdate(id, { ...otherFields }, { new: true, runValidators: true });

        if(!certExist) {
            return res.status(404).json({
                message: 'Certificate not found'
            })
        }

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('certUpdated', certExist)
        }

        res.status(200).json({
            message: 'Certificate updated successfully',
            data: certExist
        })
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = updateCert