const express = require("express");
const router = express.Router();

const leaveBalanceController = require("../controllers/leaveBalanceController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get all leave balances
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    leaveBalanceController.getAllLeaveBalances
);

// Get leave balance by employee id
router.get(
    "/:employeeId",
    authenticateToken,
    authorizeRoles("admin", "manager", "employee"),
    leaveBalanceController.getLeaveBalanceByEmployee
);

// Update leave balance
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    leaveBalanceController.updateLeaveBalance
);

module.exports = router;