const leaveRequestService = require("../services/leaveRequestService");

const applyLeave = async (req, res, next) => {
    try {

        const leave = await leaveRequestService.applyLeave(
            req.user.employeeId,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Leave applied successfully",
            data: leave
        });

    } catch (error) {
        next(error);
    }
};

const getMyLeaves = async (req, res, next) => {
    try {

        const leaves = await leaveRequestService.getMyLeaves(
            req.user.employeeId
        );

        res.status(200).json({
            success: true,
            data: leaves
        });

    } catch (error) {
        next(error);
    }
};

const getAllLeaves = async (req, res, next) => {
    try {

        const leaves = await leaveRequestService.getAllLeaves();

        res.status(200).json({
            success: true,
            data: leaves
        });

    } catch (error) {
        next(error);
    }
};

const getLeaveById = async (req, res, next) => {
    try {

        const leave = await leaveRequestService.getLeaveById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: leave
        });

    } catch (error) {
        next(error);
    }
};

const approveLeave = async (req, res, next) => {
    try {

        const leave = await leaveRequestService.approveLeave(
            req.params.id,
            req.user.id,
            req.body.manager_comment
        );

        res.status(200).json({
            success: true,
            message: "Leave approved successfully",
            data: leave
        });

    } catch (error) {
        next(error);
    }
};

const rejectLeave = async (req, res, next) => {
    try {

        const leave = await leaveRequestService.rejectLeave(
            req.params.id,
            req.user.id,
            req.body.manager_comment
        );

        res.status(200).json({
            success: true,
            message: "Leave rejected successfully",
            data: leave
        });

    } catch (error) {
        next(error);
    }
};

const cancelLeave = async (req, res, next) => {
    try {

        const leave = await leaveRequestService.cancelLeave(
            req.params.id,
            req.user.employeeId
        );

        res.status(200).json({
            success: true,
            message: "Leave cancelled successfully",
            data: leave
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    getLeaveById,
    approveLeave,
    rejectLeave,
    cancelLeave
};