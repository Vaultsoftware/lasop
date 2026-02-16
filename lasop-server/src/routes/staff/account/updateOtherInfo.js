const { getSocket } = require('../../../config/connection');
const OtherInfo = require('../../../models/staff/otherInfo');

const updateOtherInfo = async (req, res) => {
    const { id } = req.params;
    const { ...otherField } = req.body;

    try {
        const updatedInfo = await OtherInfo.findByIdAndUpdate(
            id,
            { ...otherField },
            { new: true, runValidators: true}
        )

        if(!updatedInfo) {
            return res.status(404).json({
                message: 'Information not found'
            })
        };

        const io = getSocket();
        if(io) {
            io.to('lasop_global_room').emit('updateOtherInfo', updatedInfo)
        }

        res.status(200).json({
            message: 'Information updated successfully',
            data: updatedInfo
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = updateOtherInfo;