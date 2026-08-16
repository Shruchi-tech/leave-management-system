import api from "../api/axios";

export const loginUser = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
};
export const changePassword = async (passwordData) => {
    const response = await api.put("/auth/change-password",passwordData
    );
    return response.data;
};