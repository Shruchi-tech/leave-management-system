const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const login = async ({ email, password }) => {

    // Validation
    if (!email || !validator.isEmail(email)) {
        throw {
            status: 400,
            message: "Valid email is required"
        };
    }

    if (!password) {
        throw {
            status: 400,
            message: "Password is required"
        };
    }

    // Get user from database
    const [rows] = await pool.execute(
        `SELECT 
            u.id,
            u.employee_id,
            u.email,
            u.password,
            u.role,
            u.status,
            e.full_name
        FROM users u
        JOIN employees e
        ON u.employee_id = e.id
        WHERE u.email = ?`,
        [email]
    );

    if (rows.length === 0) {
        throw {
            status: 401,
            message: "Invalid email or password"
        };
    }

    const user = rows[0];

    if (user.status === "inactive") {
        throw {
            status: 403,
            message: "Account is inactive"
        };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw {
            status: 401,
            message: "Invalid email or password"
        };
    }

    const token = jwt.sign(
        {
            id: user.id,
            employeeId: user.employee_id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            employeeId: user.employee_id,
            fullName: user.full_name,
            email: user.email,
            role: user.role
        }
    };
};
const changePassword = async (
    userId,
    { currentPassword, newPassword }
) => {

    // =========================
    // Validation
    // =========================

    if (!currentPassword || !newPassword) {
        throw {
            status: 400,
            message: "Current password and new password are required"
        };
    }

    if (newPassword.length < 6) {
        throw {
            status: 400,
            message: "New password must be at least 6 characters long"
        };
    }

    if (currentPassword === newPassword) {
        throw {
            status: 400,
            message: "New password must be different from current password"
        };
    }


    // =========================
    // Get User
    // =========================

    const [rows] = await pool.execute(
        `SELECT id, password, status
         FROM users
         WHERE id=?`,
        [userId]
    );

    if (rows.length === 0) {
        throw {
            status: 404,
            message: "User not found"
        };
    }

    const user = rows[0];


    // =========================
    // Check Account Status
    // =========================

    if (user.status === "inactive") {
        throw {
            status: 403,
            message: "Account is inactive"
        };
    }


    // =========================
    // Verify Current Password
    // =========================

    const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isMatch) {
        throw {
            status: 401,
            message: "Current password is incorrect"
        };
    }


    // =========================
    // Hash New Password
    // =========================

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );


    // =========================
    // Update Password
    // =========================

    await pool.execute(
        `UPDATE users
         SET password=?
         WHERE id=?`,
        [
            hashedPassword,
            userId
        ]
    );

    return {
        message: "Password changed successfully"
    };
};

module.exports = {
    login,
    changePassword
};