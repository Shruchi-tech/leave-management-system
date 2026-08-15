import api from "../api/axios";

export const applyLeave = async (leaveData) => {
    const response = await api.post("/leave-requests", leaveData);
    return response.data;
};

export const getMyLeaves = async () => {
    const response = await api.get("/leave-requests/my");
    return response.data.data;
};

export const getLeaveById = async (id) => {

    const response = await api.get(
        `/leave-requests/${id}`
    );

    return response.data.data;
};

export const cancelLeave = async (id) => {
    const response = await api.put(`/leave-requests/${id}/cancel`);
    return response.data;
};
// ======================================================
// Admin / Manager - Get All Leave Requests
// ======================================================

export const getAllLeaves = async () => {

    const response = await api.get(
        "/leave-requests"
    );

    return response.data.data;
};


// ======================================================
// Admin / Manager - Approve Leave
// ======================================================

export const approveLeave = async (
    id,
    managerComment = ""
) => {

    const response = await api.put(
        `/leave-requests/${id}/approve`,
        {
            manager_comment: managerComment
        }
    );

    return response.data;
};


// ======================================================
// Admin / Manager - Reject Leave
// ======================================================

export const rejectLeave = async (
    id,
    managerComment = ""
) => {

    const response = await api.put(
        `/leave-requests/${id}/reject`,
        {
            manager_comment: managerComment
        }
    );

    return response.data;
};