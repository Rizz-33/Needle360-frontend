import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  signup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, data);
      set({ user: response.data.user, isAuthenticated: true });
    } catch (error) {
      set({ error: error.response.data.message });
    }
    set({ isLoading: false });
  },
}));
