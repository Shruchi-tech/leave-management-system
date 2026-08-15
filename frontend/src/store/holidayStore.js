import { create } from "zustand";

import {
    getAllHolidays as getAllHolidaysAPI,
    createHoliday as createHolidayAPI,
    updateHoliday as updateHolidayAPI,
    deleteHoliday as deleteHolidayAPI
} from "../services/holidayService";


const useHolidayStore = create((set) => ({

    holidays: [],
    loading: false,
    error: null,


    // =========================
    // Get All Holidays
    // =========================

    fetchHolidays: async () => {

        try {

            set({
                loading: true,
                error: null
            });

            const holidays =
                await getAllHolidaysAPI();

            set({
                holidays,
                loading: false
            });

        } catch (error) {

            set({
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to fetch holidays"
            });

            throw error;
        }
    },


    // =========================
    // Add Holiday
    // =========================

    addHoliday: async (holidayData) => {

        try {

            const holiday =
                await createHolidayAPI(
                    holidayData
                );

            set((state) => ({
                holidays: [
                    ...state.holidays,
                    holiday
                ]
            }));

            return holiday;

        } catch (error) {

            throw error;
        }
    },


    // =========================
    // Edit Holiday
    // =========================

    editHoliday: async (
        id,
        holidayData
    ) => {

        try {

            const updatedHoliday =
                await updateHolidayAPI(
                    id,
                    holidayData
                );

            set((state) => ({
                holidays:
                    state.holidays.map(
                        (holiday) =>
                            holiday.id === id
                                ? {
                                    ...holiday,
                                    ...updatedHoliday
                                }
                                : holiday
                    )
            }));

            return updatedHoliday;

        } catch (error) {

            throw error;
        }
    },


    // =========================
    // Delete Holiday
    // =========================

    removeHoliday: async (id) => {

        try {

            await deleteHolidayAPI(id);

            set((state) => ({
                holidays:
                    state.holidays.filter(
                        (holiday) =>
                            holiday.id !== id
                    )
            }));

        } catch (error) {

            throw error;
        }
    }

}));


export default useHolidayStore;