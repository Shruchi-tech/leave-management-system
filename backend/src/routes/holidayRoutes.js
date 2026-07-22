const express = require("express");

const router = express.Router();

const holidayController =
    require("../controllers/holidayController");

const authenticateToken =
    require("../middleware/authenticateToken");

const authorizeRoles =
    require("../middleware/authorizeRoles");


// ======================================================
// Get All Holidays
// Admin + Manager + Employee
// ======================================================

router.get(
    "/",
    authenticateToken,
    authorizeRoles(
        "admin",
        "manager",
        "employee"
    ),
    holidayController.getAllHolidays
);


// ======================================================
// Get Holiday By ID
// Admin + Manager + Employee
// ======================================================

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles(
        "admin",
        "manager",
        "employee"
    ),
    holidayController.getHolidayById
);


// ======================================================
// Create Holiday
// Admin Only
// ======================================================

router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    holidayController.createHoliday
);


// ======================================================
// Update Holiday
// Admin Only
// ======================================================

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    holidayController.updateHoliday
);


// ======================================================
// Delete Holiday
// Admin Only
// ======================================================

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    holidayController.deleteHoliday
);


module.exports = router;