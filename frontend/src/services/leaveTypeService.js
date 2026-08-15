import api from "../api/axios";


// =========================
// Get All Leave Types
// =========================

export const getLeaveTypes = async () => {

    const response =
        await api.get("/leave-types");

    return response.data.data;
};


// =========================
// Create Leave Type
// =========================

export const createLeaveType = async (
    leaveTypeData
) => {

    const response =
        await api.post(
            "/leave-types",
            leaveTypeData
        );

    return response.data.data;
};


// =========================
// Update Leave Type
// =========================

export const updateLeaveType = async (
    id,
    leaveTypeData
) => {

    const response =
        await api.put(
            `/leave-types/${id}`,
            leaveTypeData
        );

    return response.data.data;
};


// =========================
// Delete Leave Type
// =========================

export const deleteLeaveType = async (id) => {

    const response =
        await api.delete(
            `/leave-types/${id}`
        );

    return response.data;
};