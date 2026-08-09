import api from "../api/axios";

export const applyLeave = async (leaveData) => {
    const response = await api.post(
        "/leave-requests",
        leaveData
    );

    return response.data;
};

export const getMyLeaves = async () => {
    const response = await api.get(
        "/leave-requests/my"
    );

    return response.data;
};

export const cancelLeave = async (id) => {
    const response = await api.put(
        `/leave-requests/${id}/cancel`
    );

    return response.data;
};