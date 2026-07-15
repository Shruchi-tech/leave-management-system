const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/departmentController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get all departments
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "manager"),
    departmentController.getAllDepartments
);

// Get department by id
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "manager"),
    departmentController.getDepartmentById
);

// Create department
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    departmentController.createDepartment
);

// Update department
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    departmentController.updateDepartment
);

// Soft Delete
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    departmentController.deleteDepartment
);

module.exports = router;