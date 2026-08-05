const employeeDashboardService =
    require("../services/employeeDashboardService");

const getEmployeeDashboard = async (
    req,
    res,
    next
) => {

    try {

        const dashboard =
            await employeeDashboardService.getEmployeeDashboard(
                req.user.employeeId
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
    getEmployeeDashboard
};