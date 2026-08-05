const pool = require("../db/db");

// ======================================================
// Leave Summary
// ======================================================

const getLeaveSummary = async () => {

    const [rows] = await pool.execute(
        `SELECT
            COUNT(*) AS total_requests,

            SUM(CASE
                WHEN status='pending'
                THEN 1
                ELSE 0
            END) AS pending,

            SUM(CASE
                WHEN status='approved'
                THEN 1
                ELSE 0
            END) AS approved,

            SUM(CASE
                WHEN status='rejected'
                THEN 1
                ELSE 0
            END) AS rejected,

            SUM(CASE
                WHEN status='cancelled'
                THEN 1
                ELSE 0
            END) AS cancelled

        FROM leave_requests`
    );

    return rows[0];

};


// ======================================================
// Employee Leave History
// ======================================================

const getEmployeeLeaveHistory = async (employeeId) => {

    const [employee] = await pool.execute(
        `SELECT id
         FROM employees
         WHERE id=?`,
        [employeeId]
    );

    if (employee.length === 0) {

        throw {
            status: 404,
            message: "Employee not found"
        };

    }

    const [rows] = await pool.execute(
        `SELECT
            lr.id,
            lt.name AS leave_type,
            lt.code,
            lr.start_date,
            lr.end_date,
            lr.total_days,
            lr.reason,
            lr.status,
            lr.manager_comment,
            lr.created_at

        FROM leave_requests lr

        JOIN leave_types lt
            ON lr.leave_type_id = lt.id

        WHERE lr.employee_id=?

        ORDER BY lr.created_at DESC`,
        [employeeId]
    );

    return rows;

};


// ======================================================
// Monthly Leave Report
// ======================================================

const getMonthlyLeaveReport = async (month, year) => {

    const [rows] = await pool.execute(
        `SELECT
            lr.id,
            e.employee_code,
            e.full_name,
            d.name AS department,
            lt.name AS leave_type,
            lr.start_date,
            lr.end_date,
            lr.total_days,
            lr.status

        FROM leave_requests lr

        JOIN employees e
            ON lr.employee_id=e.id

        LEFT JOIN departments d
            ON e.department_id=d.id

        JOIN leave_types lt
            ON lr.leave_type_id=lt.id

        WHERE MONTH(lr.start_date)=?
        AND YEAR(lr.start_date)=?

        ORDER BY lr.start_date`,
        [month, year]
    );

    return rows;

};

module.exports = {
    getLeaveSummary,
    getEmployeeLeaveHistory,
    getMonthlyLeaveReport
};