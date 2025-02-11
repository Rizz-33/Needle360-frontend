// Auth.store.jsx
import axios from "axios";
import { create } from "zustand";
import { roleTypeNumbers } from "../configs/User.config";

// If you're using Create React App, uncomment this instead:
// const API_URL = window.env?.REACT_APP_API_URL || "http://localhost:3000";

// Auth.store.jsx
const API_URL = import.meta.env.API_URL || "http://localhost:4000";

// Add more axios configuration
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Optional: Add axios interceptors for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (values, roleType) => {
    // Map frontend field names to backend field names
    const mappedValues = {
      email: values.email,
      password: values.password,
      name: roleType === 1 ? values.name : values.businessName,
      role: roleTypeNumbers[roleType] || roleType,
      contactNumber: values.contactNumber,

      // For USER (roleType === 1)
      ...(roleType === 1 && {
        address: values.streetAddress,
        bankAccountNumber: values.accountNumber,
        bankName: values.bankName,
      }),

      // For TAILOR_SHOP_OWNER (roleType === 4)
      ...(roleType === 4 && {
        shopName: values.businessName,
        shopAddress: values.streetAddress,
        shopRegistrationNumber: values.registrationNumber,
      }),
    };

    try {
      set({ isLoading: true });
      const response = await axios.post(
        `${API_URL}/api/auth/signup`,
        mappedValues
      );
      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during signup";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
        code,
      });
      set({ user: response.data.user, isAuthenticated: true });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during email verification";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
