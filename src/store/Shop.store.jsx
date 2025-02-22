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
  logos: [],
  tailors: [],
  isLoading: false,
  error: null,

  fetchLogos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/logos`);
      const shopLogos = response.data
        .map((shop) => ({
          url: shop.logoUrl,
          name: shop.shopName || "Shop Logo",
        }))
        .filter((logo) => logo.url); // Remove empty/null logos

      set({ logos: shopLogos });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load logos",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTailors: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/tailors`);
      console.log("API Response:", response.data); // Log the response to check the structure

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

      console.log("Filtered Tailors:", tailorData); // Log the filtered data

      // Update the state
      set({ tailors: tailorData });

      // Check if the state is updated correctly
      console.log("Updated Tailors in Store:", tailorData);
    } catch (error) {
      console.error("Error fetching tailors:", error);
      set({ error: error.response?.data?.message || "Failed to load tailors" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
