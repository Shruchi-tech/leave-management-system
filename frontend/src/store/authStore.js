import { create } from "zustand";

import {
    loginUser,
    changePassword as changePasswordAPI
} from "../services/authService";

import api from "../api/axios";

const useAuthStore = create((set) => ({

    user: JSON.parse(localStorage.getItem("user")) || null,

    token: localStorage.getItem("token"),

    isAuthenticated: !!localStorage.getItem("token"),

    loading: false,
    initializing: true,
    
     // initializing
     initializeAuth: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            initializing: false
        });
        return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
        set({
            user: JSON.parse(storedUser),
            token,
            isAuthenticated: true
        });
    }

    try {
        const response = await api.get("/auth/profile");

        const user = response.data.user;

        localStorage.setItem("user", JSON.stringify(user));

        set({
            user,
            token,
            isAuthenticated: true,
            initializing: false
        });
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        set({
            user: null,
            token: null,
            isAuthenticated: false,
            initializing: false
        });
    }
},

    // =========================
    // Login
    // =========================

    login: async (credentials) => {

        set({ loading: true });

        try {

            const response = await loginUser(credentials);

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            set({
                token,
                user,
                isAuthenticated: true,
                loading: false,
            });

            return response;

        } catch (error) {

            set({ loading: false });

            throw error;
        }
    },


    // =========================
    // Fetch Profile
    // =========================

    fetchProfile: async () => {

        try {

            const response =
                await api.get("/auth/profile");

           const user = response.data.user;

            localStorage.setItem("user", JSON.stringify(user));

          set({
               user,
              isAuthenticated: true,
            });

        } catch (error) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            set({
                user: null,
                token: null,
                isAuthenticated: false,
            });
        }
    },


    // =========================
    // Change Password
    // =========================

    changePassword: async (passwordData) => {

        set({ loading: true });

        try {

            const response =
                await changePasswordAPI(passwordData);

            set({
                loading: false
            });

            return response;

        } catch (error) {

            set({
                loading: false
            });

            throw error;
        }
    },


    // =========================
    // Logout
    // =========================

    logout: () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },

}));

export default useAuthStore;