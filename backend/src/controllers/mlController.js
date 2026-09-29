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

module.exports = {
    getDateSuggestions
};