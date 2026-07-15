const express= require("express");
const router= express.Router();
const {login}=require("../controllers/authController");
router.post("/login",login);
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles=require("../middleware/authorizeRoles");
router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});
router.get(
  "/admin",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin"
    });
  }
);
router.get(
  "/manager",
  authenticateToken,
  authorizeRoles("manager"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Manager"
    });
  }
);
module.exports= router;