const express = require("express");
const router = express.Router();

const mlController = require("../controllers/mlController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

router.get(
    "/date-suggestions",
    authenticateToken,
    authorizeRoles("employee"),
    mlController.getDateSuggestions
);


router.get(
    "/coverage",
    authenticateToken,
    authorizeRoles("employee"),
    mlController.getCoverageWarning
);

module.exports = router;