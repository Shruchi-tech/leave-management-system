import api from "../api/axios";

export const getLeaveTypes = async () => {
    const response = await api.get("/leave-types");
    return response.data.data;
};