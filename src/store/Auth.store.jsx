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

    try {
      set({ isLoading: true });
      const response = await axios.post(`${BASE_API_URL}/signup`, mappedValues);

      // Set user data directly from signup response
      const userData = response.data.user;
      const normalizedUser = {
        ...userData,
        id: userData._id || userData.id,
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
        error.response?.data?.message || "An error occurred during signup";
      set({
        error: errorMessage,
        user: null,
        isAuthenticated: false,
        isApproved: false,
      });
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

      const userData = response.data.user;
      const normalizedUser = {
        ...userData,
        id: userData._id || userData.id,
      };

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

      const userData = response.data.user;
      const normalizedUser = {
        ...userData,
        id: userData._id || userData.id,
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
      const userData = response.data.user;

      // Normalize the user object to have a consistent 'id' property
      const normalizedUser = {
        ...userData,
        id: userData._id || userData.id,
      };

      set({
        user: normalizedUser,
        isAuthenticated: true,
        isApproved: normalizedUser.isApproved || false,
      });

      return { user: normalizedUser };
    } catch (error) {
      console.error("CheckAuth Error:", error);
      set({
        user: null,
        isAuthenticated: false,
        isApproved: false,
        error: null,
      });
      return null;
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  checkApproval: async () => {
    set({ isCheckingApproval: true, isLoading: true, error: null });

    try {
      // Get the latest user state
      const currentUser = get().user;

      // Check for both _id and id
      const userId = currentUser?._id || currentUser?.id;

      if (!userId) {
        console.warn("No authenticated user ID found in checkApproval");
        set({
          isApproved: false,
          error: "No authenticated user found",
        });
        return { isApproved: false };
      }

      const response = await axios.get(
        `${BASE_API_URL}/check-approval/${userId}`
      );

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
      console.error("CheckApproval Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while checking approval status";

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
}));
