const Report = require("../../models/report");

const getReportDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const report = await Report.findById(id).populate('staffId');

        if (!report) {
            return res.status(404).json({
                message: "Report not found"
            });
        }
        res.status(200).json(report);
    } catch {
        res.status(400).json({ error: error.message });
    }
}

module.exports = getReportDetails;