const mlService = require("../services/mlService");

const getDateSuggestions = async (req, res, next) => {
    try {
        const days = Number(req.query.days);

        if (!days || days <= 0 || days > 30) {
            return res.status(400).json({
                success: false,
                message: "Days must be between 1 and 30"
            });
        }

        const suggestions =
            await mlService.getDateSuggestions(
                req.user.employeeId,
                days
            );

        res.status(200).json({
            success: true,
            data: suggestions
        });

    } catch (error) {
        next(error);
    }
};


const getCoverageWarning = async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }

        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (
            !datePattern.test(start_date) ||
            !datePattern.test(end_date) ||
            start_date > end_date
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid dates in YYYY-MM-DD format"
            });
        }

        const result = await mlService.getCoverageWarning(
            req.user.employeeId,
            start_date,
            end_date
        );

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDateSuggestions,
    getCoverageWarning
};