import api from "../api/axios";

export const getAllEmployees = async () => {
    const response = await api.get("/employees");

    return response.data.data;
};

export const getEmployeeById = async (id) => {
    const response = await api.get(`/employees/${id}`);

    return response.data.data;
};

export const createEmployee = async (employeeData) => {
    const response = await api.post(
        "/employees",
        employeeData
    );

    return response.data.data;
};

export const updateEmployee = async (
    id,
    employeeData
) => {
    const response = await api.put(
        `/employees/${id}`,
        employeeData
    );

    return response.data.data;
};

export const deleteEmployee = async (id) => {
    const response = await api.delete(
        `/employees/${id}`
    );

    return response.data;
};