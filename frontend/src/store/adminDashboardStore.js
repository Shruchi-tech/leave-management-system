import { create } from "zustand";

import {
    getAdminDashboard as getAdminDashboardAPI
} from "../services/adminDashboardService";

const useAdminDashboardStore = create((set) => ({

    dashboard: null,
    loading: false,
    error: null,

    fetchDashboard: async () => {

        try {

            set({
                loading: true,
                error: null
            });

            const dashboard =
                await getAdminDashboardAPI();

            set({
                dashboard,
                loading: false
            });

        } catch (error) {

            set({
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to fetch admin dashboard"
            });

            throw error;
        }
    }

}));

export default useAdminDashboardStore;