import axios from "axios";
import { create } from "zustand";
import { predefinedServices } from "../configs/Services.configs";
import { useShopStore } from "./Shop.store"; // Import useShopStore

const BASE_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/services`;

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useServiceStore = create((set, get) => ({
  services: [],
  allServices: [],
  predefinedServices: predefinedServices,
  tailors: [],
  serviceSpecificTailors: [],
  isLoading: false,
  error: null,

  // Fetch all services from all tailors
  fetchAllServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}`);
      console.log("fetchAllServices response:", response.data);
      set({
        allServices: response.data.services || [],
        tailors: response.data.tailors || [],
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all services:", error);
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
      console.log(`fetchServices for tailor ${tailorId}:`, response.data);
      set({ services: response.data.services || [], isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      set({
        error: error.response?.data?.message || "Error fetching services",
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch tailors by service
  fetchTailorsByService: async (serviceName) => {
    set({ isLoading: true, error: null });
    try {
      // Normalize service name
      const normalizedServiceName = serviceName.trim();
      console.log(`Fetching tailors for service: ${normalizedServiceName}`);

      // Try backend API
      let serviceTailors = [];
      try {
        const response = await axios.get(
          `${BASE_API_URL}/service/${encodeURIComponent(normalizedServiceName)}`
        );
        console.log(
          `Backend response for ${normalizedServiceName}:`,
          response.data
        );
        serviceTailors = response.data.tailors || [];
      } catch (apiError) {
        console.warn(
          `Backend API failed for ${normalizedServiceName}, falling back to client-side filtering`,
          apiError
        );
      }

      // Fallback to client-side filtering if backend returns no tailors
      if (!serviceTailors || serviceTailors.length === 0) {
        console.log("Performing client-side filtering");
        const shopStore = useShopStore.getState();
        let tailors = shopStore.tailors;

        if (!tailors || tailors.length === 0) {
          console.log("Fetching all tailors from useShopStore");
          tailors = await shopStore.fetchTailors();
        }

        // Filter tailors by service (case-insensitive)
        serviceTailors = tailors.filter((tailor) =>
          tailor.services?.some(
            (service) =>
              service.trim().toLowerCase() ===
              normalizedServiceName.toLowerCase()
          )
        );
        console.log(
          `Client-side filtered tailors for ${normalizedServiceName}:`,
          serviceTailors
        );
      }

      set({
        serviceSpecificTailors: serviceTailors,
        isLoading: false,
      });
      return serviceTailors;
    } catch (error) {
      console.error(`Error fetching tailors for ${serviceName}:`, error);
      set({
        error:
          error.response?.data?.message ||
          `Error fetching tailors for ${serviceName}`,
        isLoading: false,
        serviceSpecificTailors: [],
      });
      throw error;
    }
  },

  // Add services to a tailor's services list
  addServices: async (tailorId, services) => {
    if (!tailorId || !services || !Array.isArray(services)) {
      return set({
        error: "Tailor ID and services array are required",
        isLoading: false,
      });
    }

    set({ isLoading: true, error: null });
    try {
      const predefinedSet = new Set(get().predefinedServices);
      const formattedServices = services
        .map((item) =>
          typeof item === "string" ? item.trim() : item.title?.trim() || item
        )
        .filter((service) => predefinedSet.has(service));

      if (formattedServices.length === 0) {
        throw new Error("No valid predefined services were selected");
      }

      const response = await axios.post(`${BASE_API_URL}/${tailorId}`, {
        services: formattedServices,
      });

      set({
        services: response.data.services,
        isLoading: false,
      });

      get().fetchAllServices();
      return response.data;
    } catch (error) {
      console.error("Error adding services:", error);
      set({
        error: error.response?.data?.message || "Error adding services",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update all services for a tailor
  updateServices: async (tailorId, services) => {
    if (!tailorId || !Array.isArray(services)) {
      return set({
        error: "Tailor ID and services array are required",
        isLoading: false,
      });
    }

    set({ isLoading: true, error: null });
    try {
      const predefinedSet = new Set(get().predefinedServices);
      const formattedServices = services
        .map((item) =>
          typeof item === "string" ? item.trim() : item.title?.trim() || item
        )
        .filter((service) => predefinedSet.has(service));

      if (formattedServices.length === 0) {
        throw new Error("No valid predefined services were selected");
      }

      const response = await axios.put(`${BASE_API_URL}/${tailorId}`, {
        services: formattedServices,
      });

      set({
        services: response.data.services,
        isLoading: false,
      });

      get().fetchAllServices();
      return response.data;
    } catch (error) {
      console.error("Error updating services:", error);
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
      const predefinedSet = new Set(get().predefinedServices);
      const formattedServices = serviceArray
        .map((item) =>
          typeof item === "string" ? item.trim() : item.title?.trim() || item
        )
        .filter((service) => predefinedSet.has(service));

      if (formattedServices.length === 0) {
        throw new Error(
          "No valid predefined services were selected for deletion"
        );
      }

      const response = await axios.delete(`${BASE_API_URL}/${tailorId}`, {
        data: { services: formattedServices },
      });

      set({
        services: response.data.services,
        isLoading: false,
      });

      get().fetchAllServices();
      return response.data;
    } catch (error) {
      console.error("Error deleting services:", error);
      set({
        error: error.response?.data?.message || "Error deleting services",
        isLoading: false,
      });
      throw error;
    }
  },

  getLocalServices: () => get().services,
  getAllLocalServices: () => get().allServices,
  getPredefinedServices: () => get().predefinedServices,
  getLocalTailors: () => get().tailors,
  getServiceSpecificTailors: () => get().serviceSpecificTailors,
}));
