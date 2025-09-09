const Certificate = require("../../models/certificate");

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

        res.status(200).json({
            message: 'Certificate updated successfully',
            data: certExist
        })
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = updateCert