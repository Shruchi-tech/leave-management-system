const reportService = require("../services/reportService");

// ======================================================
// Leave Summary
// ======================================================

const getLeaveSummary = async (req, res, next) => {

    try {

        const summary =
            await reportService.getLeaveSummary();

        res.status(200).json({
            success: true,
            data: summary
        });

    } catch (error) {

        next(error);

    }

};


// ======================================================
// Employee Leave History
// ======================================================

const getEmployeeLeaveHistory = async (req, res, next) => {

    try {

        const history =
            await reportService.getEmployeeLeaveHistory(
                req.params.employeeId
            );

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });

    } catch (error) {

        next(error);

    }

};


// ======================================================
// Monthly Leave Report
// ======================================================

const getMonthlyLeaveReport = async (req, res, next) => {

    try {

        const { month, year } = req.query;

        if (!month || !year) {

            throw {
                status: 400,
                message: "Month and year are required"
            };

        }

        const report =
            await reportService.getMonthlyLeaveReport(
                month,
                year
            );

        res.status(200).json({
            success: true,
            count: report.length,
            data: report
        });

    } catch (error) {

        next(error);

    }

};


module.exports = {
    getLeaveSummary,
    getEmployeeLeaveHistory,
    getMonthlyLeaveReport
};