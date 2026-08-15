import api from "../api/axios";

export const getAdminDashboard = async () => {

    const response =
        await api.get("/manager-dashboard");

    return response.data.data;
};