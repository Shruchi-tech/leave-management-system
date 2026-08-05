const express = require("express");

const router = express.Router();

const employeeDashboardController =
    require("../controllers/employeeDashboardController");

const authenticateToken =
    require("../middleware/authenticateToken");

const authorizeRoles =
    require("../middleware/authorizeRoles");

router.get(
    "/",
    authenticateToken,
    authorizeRoles("employee"),
    employeeDashboardController.getEmployeeDashboard
);

module.exports = router;