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
  isLoading: false,
  error: null,

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
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching services",
        isLoading: false,
      });
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
}));
