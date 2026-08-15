import api from "../api/axios";


// =========================
// Get All Holidays
// =========================

export const getAllHolidays = async () => {

    const response = await api.get("/holidays");

    return response.data.data;
};


// =========================
// Create Holiday
// =========================

export const createHoliday = async (holidayData) => {

    const response = await api.post(
        "/holidays",
        holidayData
    );

    return response.data.data;
};


// =========================
// Update Holiday
// =========================

export const updateHoliday = async (
    id,
    holidayData
) => {

    const response = await api.put(
        `/holidays/${id}`,
        holidayData
    );

    return response.data.data;
};


// =========================
// Delete Holiday
// =========================

export const deleteHoliday = async (id) => {

    const response = await api.delete(
        `/holidays/${id}`
    );

    return response.data;
};