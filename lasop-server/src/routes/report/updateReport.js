const Report = require("../../models/report");

const updateReport = async (req, res) => {
    const { id } = req.params;
    const { ...otherField } = req.body;

    try {
        const updatedReport = await Report.findByIdAndUpdate(
            id,
            {...otherField },
            { new: true, runValidators: true }
        );

        if(!updatedReport) {
            return res.status(404).json({ message: "Report not found." });
        }

        res.status(200).json({ message: "Report updated successfully.", data: updatedReport });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = updateReport;