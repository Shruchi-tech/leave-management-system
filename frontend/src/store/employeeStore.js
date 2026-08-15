import { create } from "zustand";

import {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../services/employeeService";

const useEmployeeStore = create((set) => ({

    employees: [],
    loading: false,
    error: null,

    fetchEmployees: async () => {

        try {

            set({
                loading: true,
                error: null
            });

            const employees =
                await getAllEmployees();

            set({
                employees,
                loading: false
            });

        } catch (error) {

            set({
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to fetch employees"
            });

            throw error;
        }
    },


    addEmployee: async (employeeData) => {

        try {

            const employee =
                await createEmployee(employeeData);

            set((state) => ({
                employees: [
                    employee,
                    ...state.employees
                ]
            }));

            return employee;

        } catch (error) {

            throw error;
        }
    },


    editEmployee: async (
        id,
        employeeData
    ) => {

        try {

            const updatedEmployee =
                await updateEmployee(
                    id,
                    employeeData
                );

            set((state) => ({
                employees:
                    state.employees.map((employee) =>
                        employee.id === id
                            ? {
                                ...employee,
                                ...updatedEmployee
                            }
                            : employee
                    )
            }));

            return updatedEmployee;

        } catch (error) {

            throw error;
        }
    },


    removeEmployee: async (id) => {

        try {

            await deleteEmployee(id);

            set((state) => ({
                employees:
                    state.employees.filter(
                        (employee) =>
                            employee.id !== id
                    )
            }));

        } catch (error) {

            throw error;
        }
    }

}));

export default useEmployeeStore;