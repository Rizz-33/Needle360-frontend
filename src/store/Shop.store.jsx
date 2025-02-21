import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.API_URL || "http://localhost:4000"
}/api/tailor`;

export const useShopStore = create((set) => ({
  logos: [],
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
      set({ error: error.response?.data?.message || "Failed to load logos" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
