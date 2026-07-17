const pool = require("../db/db");

// Get all balances
const getAllLeaveBalances = async () => {

    const [rows] = await pool.execute(`
        SELECT
            elb.id,
            e.employee_code,
            e.full_name,
            lt.name AS leave_type,
            lt.code,
            elb.used_days,
            elb.remaining_days
        FROM employee_leave_balances elb
        JOIN employees e
            ON elb.employee_id = e.id
        JOIN leave_types lt
            ON elb.leave_type_id = lt.id
        ORDER BY e.full_name
    `);

    return rows;
};

// Get balance of one employee
const getLeaveBalanceByEmployee = async (employeeId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            elb.id,
            lt.name,
            lt.code,
            elb.used_days,
            elb.remaining_days
        FROM employee_leave_balances elb
        JOIN leave_types lt
            ON elb.leave_type_id = lt.id
        WHERE elb.employee_id=?
        `,
        [employeeId]
    );

    if (rows.length === 0) {
        throw {
            status: 404,
            message: "Leave balance not found"
        };
    }

    return rows;
};

// Update balance
const updateLeaveBalance = async (
    id,
    {
        used_days,
        remaining_days
    }
) => {

    const [rows] = await pool.execute(
        `SELECT *
         FROM employee_leave_balances
         WHERE id=?`,
        [id]
    );

    if (rows.length === 0) {
        throw {
            status: 404,
            message: "Leave balance not found"
        };
    }

    await pool.execute(
        `
        UPDATE employee_leave_balances
        SET
            used_days=?,
            remaining_days=?
        WHERE id=?
        `,
        [
            used_days,
            remaining_days,
            id
        ]
    );

    return {
        id,
        used_days,
        remaining_days
    };
};

module.exports = {
    getAllLeaveBalances,
    getLeaveBalanceByEmployee,
    updateLeaveBalance
};