import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/tailor`;

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

export const useShopStore = create((set, get) => ({
  tailors: [],
  tailor: null,
  isLoading: false,
  error: null,

  // Fetch all tailors
  fetchTailors: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/tailors`);

      const tailorData = response.data
        .map((tailor) => ({
          _id: tailor._id, // Ensure _id is included
          email: tailor.email,
          name: tailor.name,
          shopName: tailor.shopName,
          contactNumber: tailor.contactNumber,
          logoUrl: tailor.logoUrl,
          shopAddress: tailor.shopAddress,
          role: tailor.role,
          services: tailor.services || [],
        }))
        .filter((tailor) => tailor.email); // Filtering out any null or undefined emails

      // Update the state
      set({ tailors: tailorData });
      return tailorData;
    } catch (error) {
      console.error("Error fetching tailors:", error);
      set({ error: error.response?.data?.message || "Failed to load tailors" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a tailor by ID
  fetchTailorById: async (id) => {
    // Don't proceed if id is undefined
    if (!id || id === "undefined") {
      set({ error: "Invalid tailor ID", tailor: null });
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${BASE_API_URL}/tailors/${id}?excludeDesigns=true`
      );
      set({ tailor: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching tailor:", error);
      set({
        error: error.response?.data?.message || "Failed to load tailor",
        tailor: null,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update a tailor by ID
  updateTailor: async (id, updateData) => {
    if (!id || id === "undefined") {
      set({ error: "Invalid tailor ID" });
      throw new Error("Invalid tailor ID");
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_API_URL}/tailors/${id}`,
        updateData
      );

      // Update the current tailor if it's the one being edited
      if (get().tailor && get().tailor._id === id) {
        set({ tailor: response.data });
      }

      // Update the tailor in the tailors list if present
      const updatedTailors = get().tailors.map((tailor) =>
        tailor._id === id ? { ...tailor, ...updateData } : tailor
      );

      set({ tailors: updatedTailors });
      return response.data;
    } catch (error) {
      console.error("Error updating tailor:", error);
      set({
        error: error.response?.data?.message || "Failed to update tailor",
      });
      throw error; // Rethrow to allow handling in the component
    } finally {
      set({ isLoading: false });
    }
  },
}));
