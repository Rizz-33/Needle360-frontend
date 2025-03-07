import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.API_URL || "http://localhost:4000"
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

export const useShopStore = create((set) => ({
  tailors: [],
  tailor: null,
  isLoading: false,
  error: null,

  // Single function to fetch tailor data (including logos)
  fetchTailors: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/tailors`);
      console.log("API Response:", response.data);

      const tailorData = response.data
        .map((tailor) => ({
          email: tailor.email,
          name: tailor.name,
          shopName: tailor.shopName,
          contactNumber: tailor.contactNumber,
          logoUrl: tailor.logoUrl,
          shopAddress: tailor.shopAddress,
        }))
        .filter((tailor) => tailor.email); // Filtering out any null or undefined emails

      // Update the state
      set({ tailors: tailorData });
    } catch (error) {
      console.error("Error fetching tailors:", error);
      set({ error: error.response?.data?.message || "Failed to load tailors" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Function to fetch a tailor by ID
  fetchTailorById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/tailors/${id}`);
      console.log("API Response:", response.data);

      const tailor = {
        email: response.data.email,
        name: response.data.name,
        shopName: response.data.shopName,
        contactNumber: response.data.contactNumber,
        logoUrl: response.data.logoUrl,
        shopAddress: response.data.shopAddress,
      };

      // Update the state
      set({ tailor });
    } catch (error) {
      console.error("Error fetching tailor by ID:", error);
      set({ error: error.response?.data?.message || "Failed to load tailor" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
