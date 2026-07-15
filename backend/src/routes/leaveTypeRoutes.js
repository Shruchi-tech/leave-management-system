const express = require("express");
const router = express.Router();

const leaveTypeController = require("../controllers/leaveTypeController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get all leave types
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "manager", "employee"),
    leaveTypeController.getAllLeaveTypes
);

// Get leave type by id
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "manager", "employee"),
    leaveTypeController.getLeaveTypeById
);

// Create leave type
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    leaveTypeController.createLeaveType
);

// Update leave type
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    leaveTypeController.updateLeaveType
);

// Delete (Soft Delete)
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    leaveTypeController.deleteLeaveType
);

module.exports = router;