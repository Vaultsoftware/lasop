const { getSocket } = require("../../../config/connection");
const Certificate = require('../../../models/admin/certificate');

const delCert = async (req, res) => {
    const { id } = req.params;
    try {
        const certData = await Certificate.findByIdAndDelete(id);

        if (!certData) {
            return res.status(404).json({
                message: 'Certificate not found'
            })
        }

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('certificateDeleted', certData);
        }

        res.status(200).json({
            message: 'Certificate deleted successfully',
            data: certData
        })
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = delCert;