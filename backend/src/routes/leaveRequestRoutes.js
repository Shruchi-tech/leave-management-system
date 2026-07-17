const express = require("express");
const router = express.Router();

const leaveRequestController = require("../controllers/leaveRequestController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// Employee
router.post(
    "/",
    authenticateToken,
    authorizeRoles("employee"),
    leaveRequestController.applyLeave
);

router.get(
    "/my",
    authenticateToken,
    authorizeRoles("employee"),
    leaveRequestController.getMyLeaves
);

router.put(
    "/:id/cancel",
    authenticateToken,
    authorizeRoles("employee"),
    leaveRequestController.cancelLeave
);

// Admin / Manager
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "manager"),
    leaveRequestController.getAllLeaves
);

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "manager", "employee"),
    leaveRequestController.getLeaveById
);

router.put(
    "/:id/approve",
    authenticateToken,
    authorizeRoles("admin", "manager"),
    leaveRequestController.approveLeave
);

router.put(
    "/:id/reject",
    authenticateToken,
    authorizeRoles("admin", "manager"),
    leaveRequestController.rejectLeave
);

module.exports = router;