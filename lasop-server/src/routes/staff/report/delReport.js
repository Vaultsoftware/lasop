const Report = require("../../models/report");

const delReport = async (req, res) => {
    const { id } = req.params;

    try {
        const delReport = await Report.findByIdAndDelete(id);
        if (!delReport) {
            return res.status(404).json({
                message: "Report not found"
            });
        }
        res.json({
            message: "Report deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = delReport;