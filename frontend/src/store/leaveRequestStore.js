import { create } from "zustand";

import {
    applyLeave as applyLeaveAPI,
    getMyLeaves as getMyLeavesAPI,
    cancelLeave as cancelLeaveAPI,
    getLeaveById as getLeaveByIdAPI
} from "../services/leaveRequestService";

const useLeaveRequestStore = create((set) => ({

    leaves: [],
    loading: false,
    error: null,

    // =========================
    // Get My Leaves
    // =========================

    fetchMyLeaves: async () => {

        try {

            set({
                loading: true,
                error: null
            });

            const leaves = await getMyLeavesAPI();

            set({
                leaves,
                loading: false
            });

        } catch (error) {

            set({
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to fetch leaves"
            });

            throw error;
        }
    },


    // =========================
    // Apply Leave
    // =========================

    applyLeave: async (leaveData) => {

        try {

            set({
                loading: true,
                error: null
            });

            const response =
                await applyLeaveAPI(leaveData);

            set({
                loading: false
            });

            return response;

        } catch (error) {

            set({
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to apply leave"
            });

            throw error;
        }
    },


    // =========================
    // Cancel Leave
    // =========================

    cancelLeave: async (id) => {

        try {

            set({
                loading: true,
                error: null
            });

            const response =
                await cancelLeaveAPI(id);

            // Update local state immediately
            set((state) => ({
                leaves: state.leaves.map((leave) =>
                    leave.id === id
                        ? {
                            ...leave,
                            status: "cancelled"
                        }
                        : leave
                ),
                loading: false
            }));

            return response;

        } catch (error) {

            set({
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to cancel leave"
            });

            throw error;
        }
    },

        // =========================
    // Get Leave By ID
    // =========================

    getLeaveById: async (id) => {

        try {

           set({
               loading: true,
               error: null
           });

           const leave =
            await getLeaveByIdAPI(id);

           set({
               loading: false
           });

            return leave;

       } catch (error) {

            set({
               loading: false,
                error:
                   error.response?.data?.message ||
                   "Failed to fetch leave details"
           });

           throw error;
         }
    }

}));

export default useLeaveRequestStore;