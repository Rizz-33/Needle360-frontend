import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.API_URL || "http://localhost:4000"
}/api/design`;

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useDesignStore = create((set, get) => ({
  designs: [],
  isLoading: false,
  error: null,

  // Fetch all designs
  fetchDesigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}`);
      set({ designs: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching designs",
        isLoading: false,
      });
    }
  },

  // Fetch designs by user id
  // Fetch designs by tailor ID
  fetchDesignsById: async (tailorId) => {
    set({ isLoading: true, error: null });
    try {
      const url = tailorId ? `${BASE_API_URL}/${tailorId}` : `${BASE_API_URL}`;
      const response = await axios.get(url);
      set({ designs: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching designs",
        isLoading: false,
      });
    }
  },

  // Create a new design
  createDesign: async (design) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_API_URL}`, { design });
      set((state) => ({
        designs: [...state.designs, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating design",
        isLoading: false,
      });
    }
  },

  // Update an existing design
  updateDesign: async (designId, design) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${BASE_API_URL}/designs/${designId}`, {
        design,
      });
      set((state) => ({
        designs: state.designs.map((d) =>
          d.id === designId ? response.data : d
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating design",
        isLoading: false,
      });
    }
  },

  // Delete a design
  deleteDesign: async (designId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${BASE_API_URL}/designs/${designId}`);
      set((state) => ({
        designs: state.designs.filter((d) => d.id !== designId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting design",
        isLoading: false,
      });
    }
  },
}));
