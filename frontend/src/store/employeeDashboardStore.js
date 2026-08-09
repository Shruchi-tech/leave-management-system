import { create } from "zustand";
import { getEmployeeDashboard } from "../services/employeeDashboardService";

const useEmployeeDashboardStore = create((set) => ({
    dashboard: null,
    loading: false,
    error: null,

    fetchDashboard: async () => {
        set({
            loading: true,
            error: null
        });

        try {
            const response = await getEmployeeDashboard();

            set({
                dashboard: response.data,
                loading: false
            });

        } catch (error) {

            set({
                error:
                    error.response?.data?.message ||
                    "Failed to load dashboard",
                loading: false
            });

            throw error;
        }
    }
}));

export default useEmployeeDashboardStore;