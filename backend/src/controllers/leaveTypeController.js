const leaveTypeService = require("../services/leaveTypeService");

const getAllLeaveTypes = async (req, res, next) => {
    try {
        const leaveTypes = await leaveTypeService.getAllLeaveTypes();

        res.status(200).json({
            success: true,
            data: leaveTypes
        });
    } catch (err) {
        next(err);
    }
};

const getLeaveTypeById = async (req, res, next) => {
    try {
        const leaveType = await leaveTypeService.getLeaveTypeById(req.params.id);

        res.status(200).json({
            success: true,
            data: leaveType
        });
    } catch (err) {
        next(err);
    }
};

const createLeaveType = async (req, res, next) => {
    try {
        const result = await leaveTypeService.createLeaveType(req.body);

        res.status(201).json({
            success: true,
            message: "Leave Type Created Successfully",
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const updateLeaveType = async (req, res, next) => {
    try {
        const result = await leaveTypeService.updateLeaveType(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Leave Type Updated Successfully",
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const deleteLeaveType = async (req, res, next) => {
    try {
        await leaveTypeService.deleteLeaveType(req.params.id);

        res.status(200).json({
            success: true,
            message: "Leave Type Deleted Successfully"
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllLeaveTypes,
    getLeaveTypeById,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType
};