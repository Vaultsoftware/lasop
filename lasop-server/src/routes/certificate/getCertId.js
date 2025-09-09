const Certificate = require("../../models/certificate");

const getCertId = async (req, res) => {
    const { id } = req.params;
    try {
        const certId = await Certificate.findById(id).populate('studentId');

        if(!certId) {
            return res.status(404).json({
                message: 'No certificate found'
            })
        }

        res.status(200).json(certId);
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getCertId;