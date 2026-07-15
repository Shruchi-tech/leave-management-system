const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const leaveTypeRoutes = require("./routes/leaveTypeRoutes");

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/leave-types", leaveTypeRoutes);

app.get("/", (req, res) => {
    res.send("Leave Management API");
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;