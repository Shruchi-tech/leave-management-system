const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const leaveTypeRoutes = require("./routes/leaveTypeRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const leaveBalanceRoutes = require("./routes/leaveBalanceRoutes");
const leaveRequestRoutes = require("./routes/leaveRequestRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const managerDashboardRoutes =
    require("./routes/managerDashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const employeeDashboardRoutes =require("./routes/employeeDashboardRoutes");
const mlRoutes = require("./routes/mlRoutes");
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/leave-types", leaveTypeRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leave-balances", leaveBalanceRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);
app.use("/api/holidays",holidayRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/employee-dashboard", employeeDashboardRoutes);
app.use("/api/ml", mlRoutes);
app.get("/", (req, res) => {
    res.send("Leave Management API");
});
app.use(
    "/api/manager-dashboard",
    managerDashboardRoutes
);

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


       