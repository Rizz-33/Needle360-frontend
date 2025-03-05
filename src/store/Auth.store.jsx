import axios from "axios";
import { create } from "zustand";
import { roleTypeNumbers } from "../configs/User.config";

const BASE_API_URL = `${
  import.meta.env.API_URL || "http://localhost:4000"
}/api/auth`;

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add axios interceptors for error handling
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
  isApproved: false,

  signup: async (values, roleType) => {
    const mappedValues = {
      email: values.email,
      password: values.password,
      name: values.name,
      role: roleTypeNumbers[roleType] || roleType,
      contactNumber: values.contactNumber,
      country: values.country,
      province: values.province,
      city: values.city,
      postalCode: values.postalCode,
      bankAccountNumber: values.accountNumber,
      bankName: values.bankName,
      ...(roleType === 1 && {
        address: values.address,
      }),
      ...(roleType === 4 && {
        shopName: values.shopName,
        shopAddress: values.address,
        shopRegistrationNumber: values.shopRegistrationNumber,
        taxId: values.taxId,
        logoUrl: values.logoUrl || null,
      }),
    };

    console.log("Mapped Values:", mappedValues);
    console.log("Role Type:", roleType);
    console.log(
      "Shop Registration Number:",
      mappedValues.shopRegistrationNumber
    );

    try {
      set({ isLoading: true });
      const response = await axios.post(`${BASE_API_URL}/signup`, mappedValues);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isApproved: roleType === 1,
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

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_API_URL}/login`, {
        email,
        password,
      });
      set({ user: response.data.user, isAuthenticated: true, error: null });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${BASE_API_URL}/logout`);
      set({ user: null, isAuthenticated: false, error: null });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during logout";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_API_URL}/verify-email`, {
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

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_API_URL}/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.status === 400
          ? "Invalid email address"
          : "An error occurred during forgot password request");
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${BASE_API_URL}/reset-password/${token}`,
        { password }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during password reset";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/check-auth`);
      set({ user: response.data.user, isAuthenticated: true });
      return response.data;
    } catch (error) {
      set({ error: null, isAuthenticated: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
