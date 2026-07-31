const managerDashboardService = require("../services/managerDashboardService");

// ======================================================
// Get Manager Dashboard
// ======================================================

const getManagerDashboard = async (
    req,
    res,
    next
) => {

    try {

        const dashboard =
            await managerDashboardService.getManagerDashboard(
                req.user.id
            );

        res.status(200).json({
            success: true,
            data: dashboard
        });

    } catch (error) {

        next(error);

    }

};


module.exports = {
    getManagerDashboard
};