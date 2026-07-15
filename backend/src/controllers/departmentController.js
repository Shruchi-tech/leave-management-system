const departmentService = require("../services/departmentService");

const getAllDepartments = async (req, res, next) => {
    try {
        const departments = await departmentService.getAllDepartments();

        res.status(200).json({
            success: true,
            data: departments
        });

    } catch (err) {
        next(err);
    }
};

const getDepartmentById = async (req, res, next) => {
    try {

        const department = await departmentService.getDepartmentById(req.params.id);

        res.status(200).json({
            success: true,
            data: department
        });

    } catch (err) {
        next(err);
    }
};

const createDepartment = async (req, res, next) => {
    try {

        const result = await departmentService.createDepartment(req.body);

        res.status(201).json({
            success: true,
            message: "Department Created Successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

const updateDepartment = async (req, res, next) => {
    try {

        const result = await departmentService.updateDepartment(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Department Updated Successfully",
            data: result
        });

    } catch (err) {
        next(err);
    }
};

const deleteDepartment = async (req, res, next) => {
    try {

        await departmentService.deleteDepartment(req.params.id);

        res.status(200).json({
            success: true,
            message: "Department Deleted Successfully"
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};