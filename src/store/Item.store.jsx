import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.API_URL || "http://localhost:4000"
}/api/items`;

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Create a store using zustand
export const useItemStore = create((set) => ({
  items: [],
  item: null,
  error: null,
  isLoading: false,

  // Fetch all items
  getAllItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(BASE_API_URL);
      set({ items: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching items",
        isLoading: false,
      });
    }
  },

  // Fetch item by ID
  getItemById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/${id}`);
      set({ item: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching item",
        isLoading: false,
      });
    }
  },

  // Fetch item by shopName
  getItemByShopName: async (shopName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/${shopName}`);
      set({ item: response.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error fetching item by shopName",
        isLoading: false,
      });
    }
  },

  // Fetch item by name
  getItemByName: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/${name}`);
      set({ item: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching item by name",
        isLoading: false,
      });
    }
  },

  // Create a new item
  createItem: async (newItemData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(BASE_API_URL, newItemData);
      set((state) => ({
        items: [...state.items, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating item",
        isLoading: false,
      });
    }
  },

  // Update an item by ID
  updateItem: async (id, updatedItemData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_API_URL}/${id}`,
        updatedItemData
      );
      set((state) => ({
        items: state.items.map((item) =>
          item._id === id ? response.data : item
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating item",
        isLoading: false,
      });
    }
  },

  // Delete an item by ID
  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${BASE_API_URL}/${id}`);
      set((state) => ({
        items: state.items.filter((item) => item._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting item",
        isLoading: false,
      });
    }
  },
}));
