const leaveBalanceService = require("../services/leaveBalanceService");

const getAllLeaveBalances = async (req, res, next) => {
    try {

        const balances = await leaveBalanceService.getAllLeaveBalances();

        res.status(200).json({
            success: true,
            data: balances
        });

    } catch (error) {
        next(error);
    }
};

const getLeaveBalanceByEmployee = async (req, res, next) => {
    try {

        const { employeeId } = req.params;
        if (
            req.user.role === "employee" &&
            Number(employeeId) !== Number(req.user.employeeId)
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only access your own leave balance"
            });
        }
        const balance = await leaveBalanceService.getLeaveBalanceByEmployee(employeeId);

        res.status(200).json({
            success: true,
            data: balance
        });

    } catch (error) {
        next(error);
    }
    
};

// ======================================================
// Get My Leave Balance
// ======================================================

const getMyLeaveBalance = async (req, res, next) => {

    try {

        const balances =
            await leaveBalanceService.getMyLeaveBalance(
                req.user.employeeId
            );

        res.status(200).json({
            success: true,
            data: balances
        });

    } catch (error) {

        next(error);

    }

};

const updateLeaveBalance = async (req, res, next) => {
    try {

        const { id } = req.params;

        const updated = await leaveBalanceService.updateLeaveBalance(
            id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Leave balance updated successfully",
            data: updated
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllLeaveBalances,
    getLeaveBalanceByEmployee,
    getMyLeaveBalance,
    updateLeaveBalance
};