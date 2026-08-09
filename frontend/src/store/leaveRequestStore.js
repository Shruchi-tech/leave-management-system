import { create } from "zustand";

import {
    applyLeave as applyLeaveApi,
    getMyLeaves,
    cancelLeave as cancelLeaveApi
} from "../services/leaveRequestService";

import { getLeaveTypes } from "../services/leaveTypeService";

const useLeaveRequestStore = create((set) => ({
    leaves: [],
    leaveTypes: [],

    loading: false,
    leaveTypesLoading: false,
    error: null,

    fetchLeaveTypes: async () => {

        set({
            leaveTypesLoading: true,
            error: null
        });

        try {

            const response =
                await getLeaveTypes();

            set({
                leaveTypes: response.data || [],
                leaveTypesLoading: false
            });

        } catch (error) {

            set({
                error:
                    error.response?.data?.message ||
                    "Failed to fetch leave types",
                leaveTypesLoading: false
            });

        }
    },

    applyLeave: async (leaveData) => {

        set({
            loading: true,
            error: null
        });

        try {

            const response =
                await applyLeaveApi(leaveData);

            set({
                loading: false
            });

            return {
                success: true,
                data: response.data
            };

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to apply leave";

            set({
                loading: false,
                error: message
            });

            return {
                success: false,
                message
            };
        }
    },

    fetchMyLeaves: async () => {

        set({
            loading: true,
            error: null
        });

        try {

            const response =
                await getMyLeaves();

            set({
                leaves: response.data || [],
                loading: false
            });

        } catch (error) {

            set({
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to fetch leaves"
            });

        }
    },

    cancelLeave: async (id) => {

        set({
            loading: true,
            error: null
        });

        try {

            const response =
                await cancelLeaveApi(id);

            set({
                loading: false
            });

            return {
                success: true,
                data: response.data
            };

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to cancel leave";

            set({
                loading: false,
                error: message
            });

            return {
                success: false,
                message
            };
        }
    }
}));

export default useLeaveRequestStore;