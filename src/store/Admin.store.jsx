import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.API_URL || "http://localhost:4000"
}/api/admin`;

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add axios interceptors for error handling
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAdminStore = create((set, get) => ({
  isLoading: false,
  error: null,
  unapprovedTailors: [],
  unapprovedTailor: null,

  // Approve a tailor by ID
  approveTailorById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const response = await axios.post(
        `${BASE_API_URL}/tailors/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("API Response (Approve Tailor):", response.data);

      // Update the state or perform any necessary actions
      const currentState = get();
      const updatedUnapprovedTailors = currentState.unapprovedTailors.filter(
        (tailor) => tailor._id !== id
      );

      set({ unapprovedTailors: updatedUnapprovedTailors });

      return response.data;
    } catch (error) {
      console.error("Error approving tailor:", error);
      set({
        error: error.response?.data?.message || "Failed to approve tailor",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch unapproved tailors
  fetchUnapprovedTailors: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const response = await axios.get(`${BASE_API_URL}/unapproved-tailors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response (Unapproved Tailors):", response.data);

      const unapprovedTailors = response.data.map((tailor) => ({
        id: tailor._id,
        registrationNumber: tailor.registrationNumber,
        name: tailor.name,
        email: tailor.email,
        shopName: tailor.shopName,
        contactNumber: tailor.contactNumber,
        logoUrl: tailor.logoUrl,
        shopAddress: tailor.shopAddress,
      }));

      // Update the state with unapproved tailors
      set({ unapprovedTailors });
    } catch (error) {
      console.error("Error fetching unapproved tailors:", error);
      // Set empty array to prevent undefined errors
      set({
        unapprovedTailors: [],
        error:
          error.response?.data?.message || "Failed to load unapproved tailors",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch an unapproved tailor by ID
  fetchUnapprovedTailorById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const response = await axios.get(
        `${BASE_API_URL}/unapproved-tailors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response (Unapproved Tailor):", response.data);

      // Update the state with the fetched unapproved tailor
      set({ unapprovedTailor: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching unapproved tailor by ID:", error);
      set({
        error:
          error.response?.data?.message || "Failed to load unapproved tailor",
      });
      throw error; // Rethrow to allow handling in the component
    } finally {
      set({ isLoading: false });
    }
  },
}));
