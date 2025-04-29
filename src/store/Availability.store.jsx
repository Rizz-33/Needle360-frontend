import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/availability`;

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useAvailabilityStore = create((set, get) => ({
  availabilitySlots: [],
  isLoading: false,
  error: null,

  fetchTailorAvailability: async (tailorId) => {
    if (!tailorId) {
      set({ error: "Tailor ID is required", isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/${tailorId}`);
      set({ availabilitySlots: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching availability",
        isLoading: false,
      });
      throw error;
    }
  },

  createBulkAvailability: async (tailorId, slots) => {
    if (!tailorId || !slots) {
      set({ error: "Tailor ID and slots are required", isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_API_URL}/${tailorId}`, {
        slots,
      });
      // Update state with the full list returned from the backend
      set({ availabilitySlots: response.data.slots, isLoading: false });
      return response.data.slots;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error creating availability slots",
        isLoading: false,
      });
      throw error;
    }
  },

  updateBulkAvailability: async (tailorId, updates) => {
    if (!tailorId || !updates) {
      set({ error: "Tailor ID and updates are required", isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_API_URL}/tailors/${tailorId}/availability`,
        {
          updates,
        }
      );
      // Update state with the full list returned from the backend
      set({ availabilitySlots: response.data.slots, isLoading: false });
      return response.data.slots;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error updating availability slots",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBulkAvailability: async (tailorId, slotIds) => {
    if (!tailorId || !slotIds) {
      set({ error: "Tailor ID and slot IDs are required", isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/tailors/${tailorId}/availability`,
        {
          data: { slotIds },
        }
      );
      // Update state with the full list returned from the backend
      set({ availabilitySlots: response.data.slots, isLoading: false });
      return true;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error deleting availability slots",
        isLoading: false,
      });
      throw error;
    }
  },

  validateTimeFormat: (time) => {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  },

  reset: () => {
    set({
      availabilitySlots: [],
      isLoading: false,
      error: null,
    });
  },
}));
