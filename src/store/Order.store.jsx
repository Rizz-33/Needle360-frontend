import axios from "axios";
import { io } from "socket.io-client";
import { create } from "zustand";

// Get API URL from environment variables with fallback
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const BASE_API_URL = `${API_URL}/api/order`;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add axios interceptors for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message || error);
    return Promise.reject(error);
  }
);

export const useOrderStore = create((set, get) => ({
  orders: [],
  total: 0,
  currentPage: 1,
  limit: 10,
  isLoading: false,
  error: null,
  socket: null,
  paymentOrderId: null,
  paymentProcessing: false,

  initializeSocket: (userId, role) => {
    if (get().socket) {
      // Disconnect existing socket if it exists
      get().disconnectSocket();
    }

    try {
      const socket = io(API_URL, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
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

      socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${reason}`);
        if (reason === "io server disconnect") {
          // the disconnection was initiated by the server, reconnect manually
          socket.connect();
        }
      });

      set({ socket });
      return socket;
    } catch (err) {
      console.error("Socket initialization error:", err);
      set({ error: "Failed to connect to notification service" });
      return null;
    }
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
      const errorMessage =
        error.response?.data?.message || "Error fetching orders";
      console.error(errorMessage, error);
      set({
        error: errorMessage,
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
      const errorMessage =
        error.response?.data?.message || "Error fetching customer orders";
      console.error(errorMessage, error);
      set({
        error: errorMessage,
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
      const errorMessage =
        error.response?.data?.message || "Error creating order";
      console.error(errorMessage, error);
      set({
        error: errorMessage,
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
      const errorMessage =
        error.response?.data?.message || "Error approving/rejecting order";
      console.error(errorMessage, error);
      set({
        error: errorMessage,
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
      const errorMessage =
        error.response?.data?.message || "Error updating order";
      console.error(errorMessage, error);
      set({
        error: errorMessage,
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
      const errorMessage =
        error.response?.data?.message || "Error updating order status";
      console.error(errorMessage, error);
      set({
        error: errorMessage,
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
      const errorMessage =
        error.response?.data?.message || "Error deleting order";
      console.error(errorMessage, error);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  createPaymentIntent: async (orderId) => {
    set({ isLoading: true, error: null, paymentProcessing: true });
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await axios.post(
        `${BASE_API_URL}/payment/intent`,
        { orderId },
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);
      set({ isLoading: false, paymentProcessing: false });

      if (!response.data.clientSecret) {
        throw new Error("No client secret received from payment service");
      }

      return response.data;
    } catch (error) {
      let errorMessage = "Error creating payment intent";

      if (error.name === "AbortError") {
        errorMessage = "Payment request timed out. Please try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error(errorMessage, error);
      set({
        error: errorMessage,
        isLoading: false,
        paymentProcessing: false,
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

      // Update the order in the local state
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId
            ? { ...order, paymentStatus: "cod", paymentMethod: "cod" }
            : order
        ),
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error selecting COD";
      console.error(errorMessage, error);
      set({
        error: errorMessage,
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

  clearError: () => {
    set({ error: null });
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
      paymentProcessing: false,
    });
  },
}));
