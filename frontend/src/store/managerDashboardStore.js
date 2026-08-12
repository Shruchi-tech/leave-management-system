import { create } from "zustand";

import {
    getManagerDashboard as getManagerDashboardAPI
} from "../services/managerDashboardService";

const useManagerDashboardStore = create((set) => ({

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
                await getManagerDashboardAPI();

            set({
                dashboard,
                loading: false
            });

        } catch (error) {

            set({
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to fetch manager dashboard"
            });

            throw error;
        }
    }

}));

export default useManagerDashboardStore;