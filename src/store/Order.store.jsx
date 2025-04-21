import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/order`;

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useOrderStore = create((set, get) => ({
  orders: [],
  total: 0,
  currentPage: 1,
  limit: 10,
  isLoading: false,
  error: null,

  fetchOrders: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { status, page = 1, limit = 10 } = filters;

      // Build query params
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      params.append("page", page);
      params.append("limit", limit);

      const response = await axios.get(`${BASE_API_URL}?${params.toString()}`);

      set({
        orders: response.data.orders,
        total: response.data.total,
        currentPage: response.data.page,
        limit: response.data.limit,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching orders",
        isLoading: false,
      });
      throw error;
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(BASE_API_URL, orderData);

      // Add new order to the existing orders
      set((state) => ({
        orders: [response.data, ...state.orders],
        total: state.total + 1,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating order",
        isLoading: false,
      });
      throw error;
    }
  },

  updateOrder: async (id, orderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${BASE_API_URL}/${id}`, orderData);

      // Update order in the existing orders
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? response.data : order
        ),
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating order",
        isLoading: false,
      });
      throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${BASE_API_URL}/${id}`, { status });

      // Update order status in the existing orders
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? response.data : order
        ),
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating order status",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${BASE_API_URL}/${id}`);

      // Remove order from the existing orders
      set((state) => ({
        orders: state.orders.filter((order) => order._id !== id),
        total: state.total - 1,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting order",
        isLoading: false,
      });
      throw error;
    }
  },

  resetOrderFilters: () => {
    set((state) => ({
      currentPage: 1,
      // Keep the existing limit
    }));
    return get().fetchOrders({ page: 1, limit: get().limit });
  },

  reset: () => {
    set({
      orders: [],
      total: 0,
      currentPage: 1,
      limit: 10,
      isLoading: false,
      error: null,
    });
  },
}));
