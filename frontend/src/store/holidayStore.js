import { create } from "zustand";

import {
    getAllHolidays as getAllHolidaysAPI
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
    }

}));


export default useHolidayStore;