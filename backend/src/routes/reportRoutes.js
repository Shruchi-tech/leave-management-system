const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// ======================================================
// Leave Summary
// ======================================================

router.get(
    "/leave-summary",
    authenticateToken,
    authorizeRoles("admin", "manager"),
    reportController.getLeaveSummary
);

// ======================================================
// Employee Leave History
// ======================================================

router.get(
    "/employee/:employeeId",
    authenticateToken,
    authorizeRoles("admin", "manager"),
    reportController.getEmployeeLeaveHistory
);

// ======================================================
// Monthly Leave Report
// ======================================================

router.get(
    "/monthly",
    authenticateToken,
    authorizeRoles("admin", "manager"),
    reportController.getMonthlyLeaveReport
);

module.exports = router;