import { create } from "zustand";
import { loginUser } from "../services/authService";
import api from "../api/axios";

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,

    login: async (credentials) => {
        set({ loading: true });

        try {
            const response = await loginUser(credentials);

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

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

    fetchProfile: async () => {
        try {
            const response = await api.get("/auth/profile");

            set({
                user: response.data.user,
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