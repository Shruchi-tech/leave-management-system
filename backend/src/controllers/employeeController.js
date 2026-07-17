const employeeService = require("../services/employeeService");

const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await employeeService.getAllEmployees();

        res.status(200).json({
            success: true,
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

const getEmployeeById = async (req, res, next) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (err) {
        next(err);
    }
};

const createEmployee = async (req, res, next) => {
    try {
        const employee = await employeeService.createEmployee(req.body);

        res.status(201).json({
            success: true,
            message: "Employee Created Successfully",
            data: employee
        });
    } catch (err) {
        next(err);
    }
};

const updateEmployee = async (req, res, next) => {
    try {
        const employee = await employeeService.updateEmployee(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Employee Updated Successfully",
            data: employee
        });
    } catch (err) {
        next(err);
    }
};

const deleteEmployee = async (req, res, next) => {
    try {
        await employeeService.deleteEmployee(req.params.id);

        res.status(200).json({
            success: true,
            message: "Employee Deleted Successfully"
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};