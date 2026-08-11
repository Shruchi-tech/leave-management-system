import api from "../api/axios";

export const getAllHolidays = async () => {

    const response = await api.get("/holidays");

    return response.data.data;
};