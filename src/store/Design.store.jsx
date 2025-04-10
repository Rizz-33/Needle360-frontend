import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/design`;

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useDesignStore = create((set, get) => ({
  designs: [],
  tailorDesigns: [],
  customerDesigns: [],
  isLoading: false,
  error: null,

  // Helper function to transform design data
  transformDesignData: (design) => ({
    _id: design._id,
    id: design._id, // For backward compatibility
    title: design.title || design.itemName || "",
    description: design.description || "",
    price: design.price,
    imageUrl: design.imageUrl || null,
    tailorId: design.tailorId,
    customerId: design.customerId,
    userType: design.tailorId ? "tailor" : "customer",
    createdAt: design.createdAt,
    updatedAt: design.updatedAt,
  }),

  // Fetch all designs (both tailor and customer)
  fetchAllDesigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(BASE_API_URL);
      const transformedDesigns = response.data.map(get().transformDesignData);
      set({ designs: transformedDesigns, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching designs",
        isLoading: false,
      });
    }
  },

  // Fetch all tailor designs
  fetchAllTailorDesigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/tailors`);
      const transformedDesigns = response.data.map(get().transformDesignData);
      set({ tailorDesigns: transformedDesigns, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching tailor designs",
        isLoading: false,
      });
    }
  },

  // Fetch all customer designs
  fetchAllCustomerDesigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/customers`);
      const transformedDesigns = response.data.map(get().transformDesignData);
      set({ customerDesigns: transformedDesigns, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error fetching customer designs",
        isLoading: false,
      });
    }
  },

  // Fetch designs by tailor ID
  fetchTailorDesignsById: async (tailorId) => {
    if (!tailorId) return;

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/tailors/${tailorId}`);
      const transformedDesigns = response.data.map(get().transformDesignData);
      set({ tailorDesigns: transformedDesigns, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching tailor designs",
        isLoading: false,
      });
    }
  },

  // Fetch designs by customer ID
  fetchCustomerDesignsById: async (customerId) => {
    if (!customerId) return;

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${BASE_API_URL}/customers/${customerId}`
      );
      const transformedDesigns = response.data.map(get().transformDesignData);
      set({ customerDesigns: transformedDesigns, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error fetching customer designs",
        isLoading: false,
      });
    }
  },

  // Create a new design for a tailor
  createTailorDesign: async (tailorId, designData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${BASE_API_URL}/tailors/${tailorId}`, {
        design: {
          ...designData,
        },
      });

      const newDesign = get().transformDesignData(response.data.design);

      set((state) => ({
        designs: [...state.designs, newDesign],
        tailorDesigns: [...state.tailorDesigns, newDesign],
        isLoading: false,
      }));

      return newDesign;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating tailor design",
        isLoading: false,
      });
      throw error;
    }
  },

  // Create a new design for a customer
  createCustomerDesign: async (customerId, designData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${BASE_API_URL}/customers/${customerId}`,
        {
          design: {
            ...designData,
            imageURLs: designData.image ? [designData.image] : [],
          },
        }
      );

      const newDesign = get().transformDesignData(response.data.design);

      set((state) => ({
        designs: [...state.designs, newDesign],
        customerDesigns: [...state.customerDesigns, newDesign],
        isLoading: false,
      }));

      return newDesign;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error creating customer design",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update a tailor design
  updateTailorDesign: async (tailorId, designId, designData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_API_URL}/tailors/${tailorId}/designs/${designId}`,
        {
          design: {
            ...designData,
          },
        }
      );

      const updatedDesign = get().transformDesignData(response.data.design);

      set((state) => ({
        designs: state.designs.map((d) =>
          d._id === designId ? updatedDesign : d
        ),
        tailorDesigns: state.tailorDesigns.map((d) =>
          d._id === designId ? updatedDesign : d
        ),
        isLoading: false,
      }));

      return updatedDesign;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating tailor design",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update a customer design
  updateCustomerDesign: async (customerId, designId, designData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_API_URL}/customers/${customerId}/designs/${designId}`,
        {
          design: {
            ...designData,
            imageURLs: designData.image ? [designData.image] : [],
          },
        }
      );

      const updatedDesign = get().transformDesignData(response.data.design);

      set((state) => ({
        designs: state.designs.map((d) =>
          d._id === designId ? updatedDesign : d
        ),
        customerDesigns: state.customerDesigns.map((d) =>
          d._id === designId ? updatedDesign : d
        ),
        isLoading: false,
      }));

      return updatedDesign;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error updating customer design",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete a tailor design
  deleteTailorDesign: async (tailorId, designId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(
        `${BASE_API_URL}/tailors/${tailorId}/designs/${designId}`
      );

      set((state) => ({
        designs: state.designs.filter((d) => d._id !== designId),
        tailorDesigns: state.tailorDesigns.filter((d) => d._id !== designId),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting tailor design",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete a customer design
  deleteCustomerDesign: async (customerId, designId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(
        `${BASE_API_URL}/customers/${customerId}/designs/${designId}`
      );

      set((state) => ({
        designs: state.designs.filter((d) => d._id !== designId),
        customerDesigns: state.customerDesigns.filter(
          (d) => d._id !== designId
        ),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error deleting customer design",
        isLoading: false,
      });
      throw error;
    }
  },
}));
