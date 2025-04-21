import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/inventory`;

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useInventoryStore = create((set, get) => ({
  inventory: [],
  total: 0,
  currentPage: 1,
  limit: 10,
  isLoading: false,
  error: null,

  fetchInventory: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { type, isLowStock, page = 1, limit = 10 } = filters;

      // Build query params
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (isLowStock !== undefined) params.append("isLowStock", isLowStock);
      params.append("page", page);
      params.append("limit", limit);

      const response = await axios.get(`${BASE_API_URL}?${params.toString()}`);

      set({
        inventory: response.data.inventory,
        total: response.data.total,
        currentPage: response.data.page,
        limit: response.data.limit,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching inventory",
        isLoading: false,
      });
      throw error;
    }
  },

  createInventoryItem: async (itemData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(BASE_API_URL, itemData);

      // Add new item to the existing inventory
      set((state) => ({
        inventory: [...state.inventory, response.data],
        total: state.total + 1,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating inventory item",
        isLoading: false,
      });
      throw error;
    }
  },

  updateInventoryItem: async (id, itemData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${BASE_API_URL}/${id}`, itemData);

      // Update item in the existing inventory
      set((state) => ({
        inventory: state.inventory.map((item) =>
          item._id === id ? response.data : item
        ),
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating inventory item",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteInventoryItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${BASE_API_URL}/${id}`);

      // Remove item from the existing inventory
      set((state) => ({
        inventory: state.inventory.filter((item) => item._id !== id),
        total: state.total - 1,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting inventory item",
        isLoading: false,
      });
      throw error;
    }
  },

  resetInventoryFilters: () => {
    set((state) => ({
      currentPage: 1,
      // Keep the existing limit
    }));
    return get().fetchInventory({ page: 1, limit: get().limit });
  },

  reset: () => {
    set({
      inventory: [],
      total: 0,
      currentPage: 1,
      limit: 10,
      isLoading: false,
      error: null,
    });
  },
}));
