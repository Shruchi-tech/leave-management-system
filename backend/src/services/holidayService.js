const pool = require("../db/db");


// ======================================================
// Get All Holidays
// ======================================================

const getAllHolidays = async () => {

    const [rows] = await pool.execute(
        `SELECT
            id,
            title,
            holiday_date,
            description,
            created_at,
            updated_at
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
            title,
            holiday_date,
            description,
            created_at,
            updated_at
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
    title,
    holiday_date,
    description
}) => {

    // Required Fields
    if (!title || !holiday_date) {

        throw {
            status: 400,
            message: "Holiday title and date are required"
        };

    }


    // Date Validation
    const date = new Date(holiday_date);

    if (isNaN(date.getTime())) {

        throw {
            status: 400,
            message: "Invalid holiday date"
        };

    }


    // Check Duplicate Holiday
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


    // Insert Holiday
    const [result] = await pool.execute(
        `INSERT INTO holidays
        (
            title,
            holiday_date,
            description
        )
        VALUES (?, ?, ?)`,
        [
            title,
            holiday_date,
            description || null
        ]
    );


    return {
        id: result.insertId,
        title,
        holiday_date,
        description: description || null
    };

};


// ======================================================
// Update Holiday
// ======================================================

const updateHoliday = async (
    id,
    {
        title,
        holiday_date,
        description
    }
) => {

    // Check Holiday
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


    // Required Fields
    if (!title || !holiday_date) {

        throw {
            status: 400,
            message: "Holiday title and date are required"
        };

    }


    // Date Validation
    const date = new Date(holiday_date);

    if (isNaN(date.getTime())) {

        throw {
            status: 400,
            message: "Invalid holiday date"
        };

    }


    // Duplicate Date Check
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


    // Update Holiday
    await pool.execute(
        `UPDATE holidays
         SET
            title=?,
            holiday_date=?,
            description=?
         WHERE id=?`,
        [
            title,
            holiday_date,
            description || null,
            id
        ]
    );


    return {
        id,
        title,
        holiday_date,
        description: description || null
    };

};


// ======================================================
// Delete Holiday
// ======================================================

const deleteHoliday = async (id) => {

    // Check Holiday
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


    // Hard Delete
    await pool.execute(
        `DELETE FROM holidays
         WHERE id=?`,
        [id]
    );


    return {
        id,
        message: "Holiday deleted successfully"
    };

};


module.exports = {
    getAllHolidays,
    getHolidayById,
    createHoliday,
    updateHoliday,
    deleteHoliday
};