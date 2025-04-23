import axios from "axios";
import { io } from "socket.io-client";
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
  socket: null,
  paymentOrderId: null,

  initializeSocket: (userId, role) => {
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.emit("joinRoom", {
        userId,
        role: role === 4 ? "tailor" : "customer",
      });
    });

    socket.on("orderCreated", (order) => {
      set((state) => ({
        orders: [order, ...state.orders],
        total: state.total + 1,
      }));
    });

    socket.on("orderStatusUpdated", (updatedOrder) => {
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        ),
      }));
    });

    socket.on("orderDeleted", ({ id }) => {
      set((state) => ({
        orders: state.orders.filter((order) => order._id !== id),
        total: state.total - 1,
      }));
    });

    socket.on(
      "paymentStatusUpdated",
      ({ orderId, paymentStatus, paymentMethod }) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId
              ? { ...order, paymentStatus, paymentMethod }
              : order
          ),
        }));
      }
    );

    socket.on("orderReadyForPayment", ({ orderId }) => {
      set({ paymentOrderId: orderId });
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

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

  getCustomerOrdersById: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { status, page = 1, limit = 10 } = filters;

      // Build query params
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      params.append("page", page);
      params.append("limit", limit);

      const response = await axios.get(
        `${BASE_API_URL}/customer?${params.toString()}`
      );

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
        error:
          error.response?.data?.message || "Error fetching customer orders",
        isLoading: false,
      });
      throw error;
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_API_URL}/customer`, orderData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating order",
        isLoading: false,
      });
      throw error;
    }
  },

  approveOrRejectOrder: async (id, action) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${BASE_API_URL}/${id}/approve-reject`, {
        action,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error approving/rejecting order",
        isLoading: false,
      });
      throw error;
    }
  },

  updateOrder: async (id, orderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${BASE_API_URL}/${id}`, orderData);
      set({ isLoading: false });
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
      const response = await axios.put(`${BASE_API_URL}/${id}/status`, {
        status,
      });
      set({ isLoading: false });
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
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting order",
        isLoading: false,
      });
      throw error;
    }
  },

  createPaymentIntent: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_API_URL}/payment/intent`, {
        orderId,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating payment intent",
        isLoading: false,
      });
      throw error;
    }
  },

  selectCOD: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_API_URL}/payment/cod`, {
        orderId,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error selecting COD",
        isLoading: false,
      });
      throw error;
    }
  },

  resetOrderFilters: () => {
    set((state) => ({
      currentPage: 1,
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
      paymentOrderId: null,
    });
  },
}));
