const express = require("express");

const router = express.Router();

const managerDashboardController =
    require("../controllers/managerDashboardController");

const authenticateToken =
    require("../middleware/authenticateToken");

const authorizeRoles =
    require("../middleware/authorizeRoles");


// ======================================================
// Manager Dashboard
// ======================================================

router.get(
    "/",
    authenticateToken,
    authorizeRoles("manager", "admin"),
    managerDashboardController.getManagerDashboard
);


module.exports = router;