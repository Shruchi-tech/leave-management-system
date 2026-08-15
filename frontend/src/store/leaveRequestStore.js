import { create } from "zustand";

import {
    applyLeave as applyLeaveAPI,
    getMyLeaves as getMyLeavesAPI,
    cancelLeave as cancelLeaveAPI,
    getLeaveById as getLeaveByIdAPI,
    getAllLeaves as getAllLeavesAPI,
    approveLeave as approveLeaveAPI,
    rejectLeave as rejectLeaveAPI
} from "../services/leaveRequestService";


const useLeaveRequestStore = create((set) => ({

    leaves: [],
    loading: false,
    error: null,


    // ======================================================
    // Employee - Get My Leaves
    // ======================================================

    fetchMyLeaves: async () => {

        try {

            set({
                loading: true,
                error: null
            });

            const leaves =
                await getMyLeavesAPI();

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


    // ======================================================
    // Employee - Apply Leave
    // ======================================================

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


    // ======================================================
    // Employee - Cancel Leave
    // ======================================================

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

                leaves:
                    state.leaves.map((leave) =>

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


    // ======================================================
    // Get Leave By ID
    // ======================================================

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
    },


    // ======================================================
    // Admin / Manager - Get All Leaves
    // ======================================================

    fetchAllLeaves: async () => {

        try {

            set({
                loading: true,
                error: null
            });

            const leaves =
                await getAllLeavesAPI();

            set({
                leaves,
                loading: false
            });

        } catch (error) {

            set({

                loading: false,

                error:
                    error.response?.data?.message ||
                    "Failed to fetch leave requests"

            });

            throw error;
        }
    },


    // ======================================================
    // Admin / Manager - Approve Leave
    // ======================================================

    approveLeave: async (
        id,
        managerComment = ""
    ) => {

        try {

            set({
                loading: true,
                error: null
            });

            const response =
                await approveLeaveAPI(
                    id,
                    managerComment
                );


            // Update local leave status

            set((state) => ({

                leaves:
                    state.leaves.map((leave) =>

                        leave.id === id
                            ? {
                                ...leave,
                                status: "approved",
                                manager_comment:
                                    managerComment
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
                    "Failed to approve leave"

            });

            throw error;
        }
    },


    // ======================================================
    // Admin / Manager - Reject Leave
    // ======================================================

    rejectLeave: async (
        id,
        managerComment = ""
    ) => {

        try {

            set({
                loading: true,
                error: null
            });

            const response =
                await rejectLeaveAPI(
                    id,
                    managerComment
                );


            // Update local leave status

            set((state) => ({

                leaves:
                    state.leaves.map((leave) =>

                        leave.id === id
                            ? {
                                ...leave,
                                status: "rejected",
                                manager_comment:
                                    managerComment
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
                    "Failed to reject leave"

            });

            throw error;
        }
    }

}));


export default useLeaveRequestStore;