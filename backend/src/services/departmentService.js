const pool = require("../db/db");

const getAllDepartments = async () => {

    const [rows] = await pool.execute(
        "SELECT * FROM departments WHERE status='active'"
    );

    return rows;
};

const getDepartmentById = async (id) => {

    const [rows] = await pool.execute(
        "SELECT * FROM departments WHERE id=?",
        [id]
    );

    if (rows.length === 0) {
        throw {
            status: 404,
            message: "Department not found"
        };
    }

    return rows[0];
};

const createDepartment = async ({ name, code, description }) => {

    if (!name || !code) {
        throw {
            status: 400,
            message: "Name and Code are required"
        };
    }

    const [existing] = await pool.execute(
        "SELECT id FROM departments WHERE code=?",
        [code]
    );

    if (existing.length > 0) {
        throw {
            status: 400,
            message: "Department code already exists"
        };
    }

    const [result] = await pool.execute(
        `INSERT INTO departments
        (name,code,description,status)
        VALUES(?,?,?,'active')`,
        [name, code, description]
    );

    return {
        id: result.insertId,
        name,
        code,
        description,
        status: "active"
    };
};

const updateDepartment = async (id, { name, code, description, status }) => {

    const [department] = await pool.execute(
        "SELECT * FROM departments WHERE id=?",
        [id]
    );

    if (department.length === 0) {
        throw {
            status: 404,
            message: "Department not found"
        };
    }

    await pool.execute(
        `UPDATE departments
         SET name=?, code=?, description=?, status=?
         WHERE id=?`,
        [name, code, description, status, id]
    );

    return { id, name, code, description, status };
};

const deleteDepartment = async (id) => {

    const [result] = await pool.execute(
        "UPDATE departments SET status='inactive' WHERE id=?",
        [id]
    );

    if (result.affectedRows === 0) {
        throw {
            status: 404,
            message: "Department not found"
        };
    }
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};