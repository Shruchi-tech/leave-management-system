const holidayService = require("../services/holidayService");


// ======================================================
// Get All Holidays
// ======================================================

const getAllHolidays = async (
    req,
    res,
    next
) => {

    try {

        const holidays =
            await holidayService.getAllHolidays();

        res.status(200).json({

            success: true,

            message:
                "Holidays fetched successfully",

            data: holidays

        });

    } catch (error) {

        next(error);

    }

};


// ======================================================
// Get Holiday By ID
// ======================================================

const getHolidayById = async (
    req,
    res,
    next
) => {

    try {

        const holiday =
            await holidayService.getHolidayById(
                req.params.id
            );

        res.status(200).json({

            success: true,

            message:
                "Holiday fetched successfully",

            data: holiday

        });

    } catch (error) {

        next(error);

    }

};


// ======================================================
// Create Holiday
// ======================================================

const createHoliday = async (
    req,
    res,
    next
) => {

    try {

        const holiday =
            await holidayService.createHoliday(
                req.body
            );

        res.status(201).json({

            success: true,

            message:
                "Holiday created successfully",

            data: holiday

        });

    } catch (error) {

        next(error);

    }

};


// ======================================================
// Update Holiday
// ======================================================

const updateHoliday = async (
    req,
    res,
    next
) => {

    try {

        const holiday =
            await holidayService.updateHoliday(
                req.params.id,
                req.body
            );

        res.status(200).json({

            success: true,

            message:
                "Holiday updated successfully",

            data: holiday

        });

    } catch (error) {

        next(error);

    }

};


// ======================================================
// Delete Holiday
// ======================================================

const deleteHoliday = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await holidayService.deleteHoliday(
                req.params.id
            );

        res.status(200).json({

            success: true,

            message:
                "Holiday deleted successfully",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {
    getAllHolidays,
    getHolidayById,
    createHoliday,
    updateHoliday,
    deleteHoliday
};