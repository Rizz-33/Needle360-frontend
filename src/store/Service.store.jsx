import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/services`;

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useServiceStore = create((set, get) => ({
  services: [],
  allServices: [],
  tailors: [],
  isLoading: false,
  error: null,

  // Fetch all services from all tailors
  fetchAllServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}`);
      set({
        allServices: response.data.services || [],
        tailors: response.data.tailors || [],
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching all services",
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch all services for a specific tailor
  fetchServices: async (tailorId) => {
    if (!tailorId) {
      return set({
        error: "Tailor ID is required",
        isLoading: false,
      });
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/${tailorId}`);
      set({ services: response.data.services || [], isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching services",
        isLoading: false,
      });
      throw error;
    }
  },

  // Add services to a tailor's service list
  addServices: async (tailorId, services) => {
    if (!tailorId || !services || !Array.isArray(services)) {
      return set({
        error: "Tailor ID and services array are required",
        isLoading: false,
      });
    }

    set({ isLoading: true, error: null });
    try {
      const formattedServices = services.map((item) =>
        typeof item === "string" ? item : item.title || item
      );

      const response = await axios.post(`${BASE_API_URL}/${tailorId}`, {
        services: formattedServices,
      });

      set({
        services: response.data.services,
        isLoading: false,
      });

      // Refresh all services after adding new ones
      get().fetchAllServices();

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error adding services",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update all services for a tailor (replace entire list)
  updateServices: async (tailorId, services) => {
    if (!tailorId || !Array.isArray(services)) {
      return set({
        error: "Tailor ID and services array are required",
        isLoading: false,
      });
    }

    set({ isLoading: true, error: null });
    try {
      const formattedServices = services.map((item) =>
        typeof item === "string" ? item : item.title || item
      );

      const response = await axios.put(`${BASE_API_URL}/${tailorId}`, {
        services: formattedServices,
      });

      set({
        services: response.data.services,
        isLoading: false,
      });

      // Refresh all services after updating
      get().fetchAllServices();

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating services",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete specific services from a tailor's service list
  deleteServices: async (tailorId, servicesToDelete) => {
    if (!tailorId) {
      return set({
        error: "Tailor ID is required",
        isLoading: false,
      });
    }

    const serviceArray = Array.isArray(servicesToDelete)
      ? servicesToDelete
      : [servicesToDelete];

    if (serviceArray.length === 0) {
      return set({
        error: "At least one service to delete is required",
        isLoading: false,
      });
    }

    set({ isLoading: true, error: null });
    try {
      const formattedServices = serviceArray.map((item) =>
        typeof item === "string" ? item : item.title || item
      );

      const response = await axios.delete(`${BASE_API_URL}/${tailorId}`, {
        data: { services: formattedServices },
      });

      set({
        services: response.data.services,
        isLoading: false,
      });

      // Refresh all services after deleting
      get().fetchAllServices();

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting services",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get services without API call (from local state)
  getLocalServices: () => {
    return get().services;
  },

  // Get all services without API call (from local state)
  getAllLocalServices: () => {
    return get().allServices;
  },

  // Get tailors without API call (from local state)
  getLocalTailors: () => {
    return get().tailors;
  },
}));
