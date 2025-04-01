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
  isLoading: false,
  error: null,

  // Fetch all designs
  fetchAllDesigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(BASE_API_URL);

      // Transform the response data to match frontend expectations
      const transformedDesigns = response.data.map((design) => ({
        _id: design._id,
        id: design._id, // For backward compatibility
        title: design.title || design.itemName || "",
        description: design.description || "",
        price: design.price,
        imageUrl: design.imageUrl || null,
        tailorId: design.tailorId,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
      }));

      set({ designs: transformedDesigns, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching designs",
        isLoading: false,
      });
    }
  },

  // Fetch designs by tailor ID
  fetchDesignsById: async (tailorId) => {
    if (!tailorId) {
      return get().fetchAllDesigns();
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/${tailorId}`);

      // Transform the response data to match frontend expectations
      const transformedDesigns = response.data.map((design) => ({
        _id: design._id,
        id: design._id, // For backward compatibility
        title: design.title || design.itemName || "",
        description: design.description || "",
        price: design.price,
        imageUrl: design.imageUrl || null,
        tailorId: design.tailorId,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
      }));

      set({ designs: transformedDesigns, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching designs",
        isLoading: false,
      });
    }
  },

  // Create a new design for a tailor
  createDesign: async (tailorId, designData) => {
    set({ isLoading: true, error: null });
    try {
      // Prepare the design data based on what the backend expects
      const designPayload = {
        ...designData,
      };

      // Handle the different naming conventions between frontend and backend
      if (designData.image) {
        designPayload.imageURLs = [designData.image];
        delete designPayload.image;
      }

      // Make sure title and description exist if needed
      if (!designPayload.itemName && !designPayload.title) {
        designPayload.title = designData.title || "";
        designPayload.description = designData.description || "";
      }

      const response = await axios.post(`${BASE_API_URL}/${tailorId}`, {
        design: designPayload,
      });

      const newDesign = response.data.design;

      // Transform the response to match frontend expectations
      const transformedDesign = {
        _id: newDesign._id,
        id: newDesign._id,
        title: newDesign.title || newDesign.itemName || "",
        description: newDesign.description || "",
        price: newDesign.price,
        imageUrl: newDesign.imageUrl || null,
        tailorId: newDesign.tailorId,
        createdAt: newDesign.createdAt,
        updatedAt: newDesign.updatedAt,
      };

      set((state) => ({
        designs: [...state.designs, transformedDesign],
        isLoading: false,
      }));

      return transformedDesign;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating design",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update an existing design
  updateDesign: async (tailorId, designId, designData) => {
    set({ isLoading: true, error: null });
    try {
      // Prepare the design data based on what the backend expects
      const designPayload = {
        ...designData,
      };

      // Handle the different naming conventions between frontend and backend
      if (designData.image) {
        designPayload.imageURLs = [designData.image];
        delete designPayload.image;
      }

      // Make sure title and description exist if needed
      if (!designPayload.itemName && !designPayload.title) {
        designPayload.title = designData.title || "";
        designPayload.description = designData.description || "";
      }

      const response = await axios.put(
        `${BASE_API_URL}/${tailorId}/designs/${designId}`,
        {
          design: designPayload,
        }
      );

      const updatedDesign = response.data.design;

      // Transform the response to match frontend expectations
      const transformedDesign = {
        _id: updatedDesign._id,
        id: updatedDesign._id,
        title: updatedDesign.title || updatedDesign.itemName || "",
        description: updatedDesign.description || "",
        price: updatedDesign.price,
        imageUrl: updatedDesign.imageUrl || null,
        tailorId: updatedDesign.tailorId,
        createdAt: updatedDesign.createdAt,
        updatedAt: updatedDesign.updatedAt,
      };

      set((state) => ({
        designs: state.designs.map((design) =>
          design._id === designId ? transformedDesign : design
        ),
        isLoading: false,
      }));

      return transformedDesign;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating design",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete a design
  deleteDesign: async (tailorId, designId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${BASE_API_URL}/${tailorId}/designs/${designId}`);

      set((state) => ({
        designs: state.designs.filter((design) => design._id !== designId),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting design",
        isLoading: false,
      });
      throw error;
    }
  },
}));
