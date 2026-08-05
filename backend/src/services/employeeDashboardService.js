const pool = require("../db/db");

// ======================================================
// Employee Dashboard
// ======================================================

const getEmployeeDashboard = async (employeeId) => {

    // ----------------------------------------------
    // Employee Details
    // ----------------------------------------------

    const [employee] = await pool.execute(
        `SELECT
            e.id,
            e.employee_code,
            e.full_name,
            e.email,
            e.designation,
            d.name AS department
         FROM employees e
         LEFT JOIN departments d
            ON e.department_id = d.id
         WHERE e.id=?
         AND e.status='active'`,
        [employeeId]
    );

    if (employee.length === 0) {

        throw {
            status: 404,
            message: "Employee not found"
        };

    }

    // ----------------------------------------------
    // Leave Balance
    // ----------------------------------------------

    const [leaveBalance] = await pool.execute(
        `SELECT
            lt.name AS leave_type,
            lt.code,
            elb.total_allocated,
            elb.used_days,
            elb.remaining_days
         FROM employee_leave_balances elb
         JOIN leave_types lt
            ON elb.leave_type_id = lt.id
         WHERE elb.employee_id=?`,
        [employeeId]
    );

    // ----------------------------------------------
    // Leave Statistics
    // ----------------------------------------------

    const [stats] = await pool.execute(
        `SELECT
            COUNT(*) AS total_requests,

            SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END)
                AS pending,

            SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END)
                AS approved,

            SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END)
                AS rejected,

            SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END)
                AS cancelled

         FROM leave_requests

         WHERE employee_id=?`,
        [employeeId]
    );

    // ----------------------------------------------
    // Upcoming Approved Leaves
    // ----------------------------------------------

    const [upcomingLeaves] = await pool.execute(
        `SELECT
            lr.id,
            lt.name AS leave_type,
            lr.start_date,
            lr.end_date,
            lr.total_days
         FROM leave_requests lr
         JOIN leave_types lt
            ON lr.leave_type_id = lt.id
         WHERE lr.employee_id=?
         AND lr.status='approved'
         AND lr.start_date>=CURDATE()
         ORDER BY lr.start_date`,
        [employeeId]
    );

    // ----------------------------------------------
    // Recent Leave Requests
    // ----------------------------------------------

    const [recentLeaves] = await pool.execute(
        `SELECT
            lr.id,
            lt.name AS leave_type,
            lr.start_date,
            lr.end_date,
            lr.total_days,
            lr.status,
            lr.created_at
         FROM leave_requests lr
         JOIN leave_types lt
            ON lr.leave_type_id = lt.id
         WHERE lr.employee_id=?
         ORDER BY lr.created_at DESC
         LIMIT 5`,
        [employeeId]
    );

    return {

        employee: employee[0],

        leaveBalance,

        leaveStats: {
            totalRequests:
                Number(stats[0].total_requests || 0),

            pending:
                Number(stats[0].pending || 0),

            approved:
                Number(stats[0].approved || 0),

            rejected:
                Number(stats[0].rejected || 0),

            cancelled:
                Number(stats[0].cancelled || 0)
        },

        upcomingLeaves,

        recentLeaves

    };

};

module.exports = {
    getEmployeeDashboard
};