import { create } from "zustand";

import {
    getLeaveTypes as getLeaveTypesAPI,
    createLeaveType as createLeaveTypeAPI,
    updateLeaveType as updateLeaveTypeAPI,
    deleteLeaveType as deleteLeaveTypeAPI
} from "../services/leaveTypeService";


const useLeaveTypeStore = create((set) => ({

    leaveTypes: [],
    loading: false,
    error: null,


    // =========================
    // Get All Leave Types
    // =========================

    fetchLeaveTypes: async () => {

        try {

            set({
                loading: true,
                error: null
            });

            const leaveTypes =
                await getLeaveTypesAPI();

            set({
                leaveTypes,
                loading: false
            });

            return leaveTypes;

        } catch (error) {

            set({
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to fetch leave types"
            });

            throw error;
        }
    },


    // =========================
    // Add Leave Type
    // =========================

    addLeaveType: async (leaveTypeData) => {

        try {

            const leaveType =
                await createLeaveTypeAPI(
                    leaveTypeData
                );

            set((state) => ({
                leaveTypes: [
                    ...state.leaveTypes,
                    leaveType
                ]
            }));

            return leaveType;

        } catch (error) {

            throw error;
        }
    },


    // =========================
    // Edit Leave Type
    // =========================

    editLeaveType: async (
        id,
        leaveTypeData
    ) => {

        try {

            const updatedLeaveType =
                await updateLeaveTypeAPI(
                    id,
                    leaveTypeData
                );

            set((state) => ({
                leaveTypes:
                    state.leaveTypes.map(
                        (leaveType) =>
                            leaveType.id === id
                                ? {
                                    ...leaveType,
                                    ...updatedLeaveType
                                }
                                : leaveType
                    )
            }));

            return updatedLeaveType;

        } catch (error) {

            throw error;
        }
    },


    // =========================
    // Delete Leave Type
    // =========================

    removeLeaveType: async (id) => {

        try {

            await deleteLeaveTypeAPI(id);

            set((state) => ({
                leaveTypes:
                    state.leaveTypes.filter(
                        (leaveType) =>
                            leaveType.id !== id
                    )
            }));

        } catch (error) {

            throw error;
        }
    }

}));


export default useLeaveTypeStore;