import { create } from "zustand";

import {
    getAllDepartments
} from "../services/departmentService";

const useDepartmentStore = create((set) => ({

    departments: [],
    loading: false,
    error: null,

    fetchDepartments: async () => {

        try {

            set({
                loading: true,
                error: null
            });

            const departments =
                await getAllDepartments();

            set({
                departments,
                loading: false
            });

        } catch (error) {

            set({
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to fetch departments"
            });

            throw error;
        }
    }

}));

export default useDepartmentStore;