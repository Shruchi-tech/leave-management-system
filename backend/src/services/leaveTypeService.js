const pool = require("../db/db");

const getAllLeaveTypes = async () => {
    const [rows] = await pool.execute(
        "SELECT * FROM leave_types WHERE status='active'"
    );

    return rows;
};

const getLeaveTypeById = async (id) => {
    const [rows] = await pool.execute(
        "SELECT * FROM leave_types WHERE id=?",
        [id]
    );

    if (rows.length === 0) {
        throw {
            status: 404,
            message: "Leave Type not found"
        };
    }

    return rows[0];
};

const createLeaveType = async ({ name, code, total_days, description }) => {

    if (!name || !code || !total_days) {
        throw {
            status: 400,
            message: "Name, Code and Total Days are required"
        };
    }

    const [existing] = await pool.execute(
        "SELECT id FROM leave_types WHERE code=?",
        [code]
    );

    if (existing.length > 0) {
        throw {
            status: 400,
            message: "Leave Type already exists"
        };
    }

    const [result] = await pool.execute(
        `INSERT INTO leave_types
        (name,code,total_days,description,status)
        VALUES(?,?,?,?, 'active')`,
        [name, code, total_days, description]
    );

    return {
        id: result.insertId,
        name,
        code,
        total_days,
        description,
        status: "active"
    };
};

const updateLeaveType = async (id, { name, code, total_days, description, status }) => {

    const [rows] = await pool.execute(
        "SELECT * FROM leave_types WHERE id=?",
        [id]
    );

    if (rows.length === 0) {
        throw {
            status: 404,
            message: "Leave Type not found"
        };
    }

    await pool.execute(
        `UPDATE leave_types
         SET name=?, code=?, total_days=?, description=?, status=?
         WHERE id=?`,
        [name, code, total_days, description, status, id]
    );

    return {
        id,
        name,
        code,
        total_days,
        description,
        status
    };
};

const deleteLeaveType = async (id) => {

    const [result] = await pool.execute(
        "UPDATE leave_types SET status='inactive' WHERE id=?",
        [id]
    );

    if (result.affectedRows === 0) {
        throw {
            status: 404,
            message: "Leave Type not found"
        };
    }
};

module.exports = {
    getAllLeaveTypes,
    getLeaveTypeById,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType
};