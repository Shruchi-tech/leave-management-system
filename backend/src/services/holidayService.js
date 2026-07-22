const pool = require("../db/db");


// ======================================================
// Get All Holidays
// ======================================================

const getAllHolidays = async () => {

    const [rows] = await pool.execute(
        `SELECT
            id,
            holiday_date,
            name,
            description,
            status,
            created_at
         FROM holidays
         ORDER BY holiday_date ASC`
    );

    return rows;
};


// ======================================================
// Get Holiday By ID
// ======================================================

const getHolidayById = async (id) => {

    const [rows] = await pool.execute(
        `SELECT
            id,
            holiday_date,
            name,
            description,
            status,
            created_at
         FROM holidays
         WHERE id=?`,
        [id]
    );

    if (rows.length === 0) {

        throw {
            status: 404,
            message: "Holiday not found"
        };

    }

    return rows[0];
};


// ======================================================
// Create Holiday
// ======================================================

const createHoliday = async ({
    holiday_date,
    name,
    description
}) => {

    // ------------------------------------------
    // Required Fields
    // ------------------------------------------

    if (!holiday_date || !name) {

        throw {
            status: 400,
            message: "Holiday date and name are required"
        };

    }


    // ------------------------------------------
    // Date Validation
    // ------------------------------------------

    const date = new Date(holiday_date);

    if (isNaN(date.getTime())) {

        throw {
            status: 400,
            message: "Invalid holiday date"
        };

    }


    // ------------------------------------------
    // Check Duplicate Holiday
    // ------------------------------------------

    const [existing] = await pool.execute(
        `SELECT id
         FROM holidays
         WHERE holiday_date=?`,
        [holiday_date]
    );

    if (existing.length > 0) {

        throw {
            status: 400,
            message: "Holiday already exists for this date"
        };

    }


    // ------------------------------------------
    // Insert Holiday
    // ------------------------------------------

    const [result] = await pool.execute(
        `INSERT INTO holidays
        (
            holiday_date,
            name,
            description,
            status
        )
        VALUES (?, ?, ?, ?)`,
        [
            holiday_date,
            name,
            description || null,
            "active"
        ]
    );


    return {
        id: result.insertId,
        holiday_date,
        name,
        description: description || null,
        status: "active"
    };

};


// ======================================================
// Update Holiday
// ======================================================

const updateHoliday = async (
    id,
    {
        holiday_date,
        name,
        description,
        status
    }
) => {

    // ------------------------------------------
    // Check Holiday
    // ------------------------------------------

    const [existing] = await pool.execute(
        `SELECT id
         FROM holidays
         WHERE id=?`,
        [id]
    );

    if (existing.length === 0) {

        throw {
            status: 404,
            message: "Holiday not found"
        };

    }


    // ------------------------------------------
    // Required Fields
    // ------------------------------------------

    if (!holiday_date || !name) {

        throw {
            status: 400,
            message: "Holiday date and name are required"
        };

    }


    // ------------------------------------------
    // Date Validation
    // ------------------------------------------

    const date = new Date(holiday_date);

    if (isNaN(date.getTime())) {

        throw {
            status: 400,
            message: "Invalid holiday date"
        };

    }


    // ------------------------------------------
    // Duplicate Date Check
    // ------------------------------------------

    const [duplicate] = await pool.execute(
        `SELECT id
         FROM holidays
         WHERE holiday_date=?
         AND id<>?`,
        [
            holiday_date,
            id
        ]
    );

    if (duplicate.length > 0) {

        throw {
            status: 400,
            message: "Another holiday already exists for this date"
        };

    }


    // ------------------------------------------
    // Update Holiday
    // ------------------------------------------

    await pool.execute(
        `UPDATE holidays
         SET
            holiday_date=?,
            name=?,
            description=?,
            status=?
         WHERE id=?`,
        [
            holiday_date,
            name,
            description || null,
            status || "active",
            id
        ]
    );


    return {
        id,
        holiday_date,
        name,
        description: description || null,
        status: status || "active"
    };

};


// ======================================================
// Delete Holiday
// ======================================================

const deleteHoliday = async (id) => {

    // ------------------------------------------
    // Check Holiday
    // ------------------------------------------

    const [existing] = await pool.execute(
        `SELECT id
         FROM holidays
         WHERE id=?`,
        [id]
    );

    if (existing.length === 0) {

        throw {
            status: 404,
            message: "Holiday not found"
        };

    }


    // ------------------------------------------
    // Soft Delete
    // ------------------------------------------

    await pool.execute(
        `UPDATE holidays
         SET status='inactive'
         WHERE id=?`,
        [id]
    );


    return {
        id,
        status: "inactive"
    };

};


module.exports = {
    getAllHolidays,
    getHolidayById,
    createHoliday,
    updateHoliday,
    deleteHoliday
};