import axios from "axios";
import { create } from "zustand";
import { roleTypeNumbers } from "../configs/User.config";

const BASE_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/auth`;

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuthStore = create((set, get) => ({
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
      ...(roleType === 1 && {
        address: values.address,
      }),
      ...(roleType === 4 && {
        shopName: values.shopName,
        shopAddress: values.address,
        logoUrl: values.logoUrl || null,
      }),
    };

    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${BASE_API_URL}/signup`, mappedValues);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userData = response.data.user;
      const normalizedUser = {
        ...userData,
        id: userData._id || userData.id,
        registrationNumber: userData.registrationNumber,
      };

      set({
        user: normalizedUser,
        isAuthenticated: true,
        isApproved: normalizedUser.isApproved || false,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "We couldn’t create your account. Please try again.";
      set({
        error: errorMessage,
        user: null,
        isAuthenticated: false,
        isApproved: false,
      });
      throw new Error(errorMessage);
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

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userData = response.data.user;
      const normalizedUser = {
        ...userData,
        id: userData._id || userData.id,
        registrationNumber: userData.registrationNumber,
      };

      localStorage.setItem("token", response.data.token);

      set({
        user: normalizedUser,
        isAuthenticated: true,
        error: null,
        isApproved: normalizedUser.isApproved || false,
      });

      return {
        ...response.data,
        user: normalizedUser,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "We couldn’t log you in. Please try again.";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_API_URL}/logout`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "We couldn’t log you out. Please try again.";
      set({ error: errorMessage });
      throw new Error(errorMessage);
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

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userData = response.data.user;
      const normalizedUser = {
        ...userData,
        id: userData._id || userData.id,
        registrationNumber: userData.registrationNumber,
      };

      set({
        user: normalizedUser,
        isAuthenticated: true,
        isApproved: normalizedUser.isApproved || false,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "We couldn’t verify your email. Please try again.";
      set({ error: errorMessage });
      throw new Error(errorMessage);
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

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "We couldn’t process your request. Please try again.";
      set({ error: errorMessage });
      throw new Error(errorMessage);
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

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "We couldn’t reset your password. Please try again.";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        set({
          user: null,
          isAuthenticated: false,
          isApproved: false,
          error: null,
        });
        return { user: null, isAuthenticated: false };
      }

      const response = await axios.get(`${BASE_API_URL}/check-auth`);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userData = response.data.user;
      const normalizedUser = {
        ...userData,
        id: userData._id || userData.id,
        registrationNumber: userData.registrationNumber,
      };

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      set({
        user: normalizedUser,
        isAuthenticated: true,
        isApproved: normalizedUser.isApproved || false,
        error: null,
      });

      return { user: normalizedUser, isAuthenticated: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";

      if (
        error.response?.status === 401 ||
        errorMessage.includes("Please log in to continue") ||
        errorMessage.includes("Your session has expired")
      ) {
        localStorage.removeItem("token");
        set({
          user: null,
          isAuthenticated: false,
          isApproved: false,
          error: null,
        });
        return { user: null, isAuthenticated: false };
      }

      set({
        user: null,
        isAuthenticated: false,
        isApproved: false,
        error: errorMessage,
      });
      return { user: null, isAuthenticated: false };
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  checkApproval: async () => {
    set({ isCheckingApproval: true, isLoading: true, error: null });

    try {
      const currentUser = get().user;
      const userId = currentUser?._id || currentUser?.id;

      if (!userId) {
        set({
          isApproved: false,
          error: "Please log in to check your approval status.",
        });
        return { isApproved: false };
      }

      const response = await axios.get(
        `${BASE_API_URL}/check-approval/${userId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const isApproved = response.data.isApproved === true;

      set({
        isApproved: isApproved,
        user: {
          ...currentUser,
          isApproved: isApproved,
        },
      });

      return { isApproved };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "We couldn’t check your approval status. Please try again.";
      set({
        error: errorMessage,
        isApproved: false,
      });
      return { isApproved: false };
    } finally {
      set({
        isCheckingApproval: false,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
