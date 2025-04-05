import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/availability`;

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useAvailabilityStore = create((set, get) => ({
  availabilitySlots: [],
  isLoading: false,
  error: null,

  // Fetch availability slots for a specific tailor
  fetchTailorAvailability: async (tailorId) => {
    if (!tailorId) {
      set({ error: "Tailor ID is required", isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/${tailorId}`);

      set({ availabilitySlots: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching availability",
        isLoading: false,
      });
    }
  },

  // Create multiple availability slots
  createBulkAvailability: async (tailorId, slots) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_API_URL}/${tailorId}`, {
        slots,
      });

      set((state) => ({
        availabilitySlots: [...state.availabilitySlots, ...response.data.slots],
        isLoading: false,
      }));

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

  // Update multiple availability slots
  updateBulkAvailability: async (tailorId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_API_URL}/tailors/${tailorId}/availability`,
        {
          updates,
        }
      );

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

  // Delete multiple availability slots
  deleteBulkAvailability: async (tailorId, slotIds) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/tailors/${tailorId}/availability`,
        {
          data: { slotIds },
        }
      );

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

  // Helper function to format time for API requests
  formatTimeForAPI: (timeString) => {
    // Convert time from any format to HH:MM format expected by API
    if (!timeString) return null;

    let time;
    if (typeof timeString === "string") {
      // If already a string, parse it
      const [hours, minutes] = timeString.split(":");
      time = { hours: parseInt(hours), minutes: parseInt(minutes) };
    } else if (timeString instanceof Date) {
      // If Date object, extract hours and minutes
      time = {
        hours: timeString.getHours(),
        minutes: timeString.getMinutes(),
      };
    } else {
      return null;
    }

    // Format to HH:MM
    return `${time.hours.toString().padStart(2, "0")}:${time.minutes
      .toString()
      .padStart(2, "0")}`;
  },

  // Reset the store
  reset: () => {
    set({
      availabilitySlots: [],
      isLoading: false,
      error: null,
    });
  },
}));
