const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employeeController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get All Employees
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "manager"),
    employeeController.getAllEmployees
);

// Get Employee By Id
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "manager"),
    employeeController.getEmployeeById
);

// Create Employee
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    employeeController.createEmployee
);

// Update Employee
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    employeeController.updateEmployee
);

// Soft Delete Employee
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    employeeController.deleteEmployee
);

module.exports = router;