import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/offer`;

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useOfferStore = create((set, get) => ({
  offers: [],
  isLoading: false,
  error: null,

  // Fetch all offers from all tailors
  fetchAllOffers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(BASE_API_URL);

      // Transform the response data to match frontend expectations
      const transformedOffers = response.data.map((offer) => ({
        _id: offer._id,
        id: offer._id, // For backward compatibility
        title: offer.title || "",
        description: offer.description || "",
        percentage: offer.percentage || 0,
        startDate: offer.startDate ? new Date(offer.startDate) : null,
        endDate: offer.endDate ? new Date(offer.endDate) : null,
        imageUrl: offer.image || offer.imageUrl || null,
        tailorId: offer.tailorId,
        createdAt: offer.createdAt,
        updatedAt: offer.updatedAt,
      }));

      set({ offers: transformedOffers, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching offers",
        isLoading: false,
      });
    }
  },

  // Fetch offers by tailor ID
  fetchOffersByTailorId: async (tailorId) => {
    if (!tailorId) {
      return get().fetchAllOffers();
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/${tailorId}`);

      // Transform the response data to match frontend expectations
      const transformedOffers = response.data.map((offer) => ({
        _id: offer._id,
        id: offer._id, // For backward compatibility
        title: offer.title || "",
        description: offer.description || "",
        percentage: offer.percentage || 0,
        startDate: offer.startDate ? new Date(offer.startDate) : null,
        endDate: offer.endDate ? new Date(offer.endDate) : null,
        imageUrl: offer.image || offer.imageUrl || null,
        tailorId: offer.tailorId,
        createdAt: offer.createdAt,
        updatedAt: offer.updatedAt,
      }));

      set({ offers: transformedOffers, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching offers",
        isLoading: false,
      });
    }
  },

  // Create a new offer for a tailor
  createOffer: async (tailorId, offerData) => {
    set({ isLoading: true, error: null });
    try {
      // Prepare the offer data based on what the backend expects
      const offerPayload = {
        title: offerData.title,
        description: offerData.description,
        percentage: offerData.percentage || 0,
        startDate: offerData.startDate || null,
        endDate: offerData.endDate || null,
        image: offerData.imageUrl || offerData.image || null,
      };

      const response = await axios.post(`${BASE_API_URL}/${tailorId}`, {
        offer: offerPayload,
      });

      const newOffer = response.data.offer;

      // Transform the response to match frontend expectations
      const transformedOffer = {
        _id: newOffer._id,
        id: newOffer._id,
        title: newOffer.title || "",
        description: newOffer.description || "",
        percentage: newOffer.percentage || 0,
        startDate: newOffer.startDate ? new Date(newOffer.startDate) : null,
        endDate: newOffer.endDate ? new Date(newOffer.endDate) : null,
        imageUrl: newOffer.image || newOffer.imageUrl || null,
        tailorId: newOffer.tailorId,
        createdAt: newOffer.createdAt,
        updatedAt: newOffer.updatedAt,
      };

      set((state) => ({
        offers: [...state.offers, transformedOffer],
        isLoading: false,
      }));

      return transformedOffer;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating offer",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update an existing offer
  updateOffer: async (tailorId, offerId, offerData) => {
    set({ isLoading: true, error: null });
    try {
      // Prepare the offer data based on what the backend expects
      const offerPayload = {
        title: offerData.title,
        description: offerData.description,
        percentage: offerData.percentage || 0,
        startDate: offerData.startDate || null,
        endDate: offerData.endDate || null,
        image: offerData.imageUrl || offerData.image || null,
      };

      const response = await axios.put(
        `${BASE_API_URL}/${tailorId}/offers/${offerId}`,
        {
          offer: offerPayload,
        }
      );

      const updatedOffer = response.data.offer;

      // Transform the response to match frontend expectations
      const transformedOffer = {
        _id: updatedOffer._id,
        id: updatedOffer._id,
        title: updatedOffer.title || "",
        description: updatedOffer.description || "",
        percentage: updatedOffer.percentage || 0,
        startDate: updatedOffer.startDate
          ? new Date(updatedOffer.startDate)
          : null,
        endDate: updatedOffer.endDate ? new Date(updatedOffer.endDate) : null,
        imageUrl: updatedOffer.image || updatedOffer.imageUrl || null,
        tailorId: updatedOffer.tailorId,
        createdAt: updatedOffer.createdAt,
        updatedAt: updatedOffer.updatedAt,
      };

      set((state) => ({
        offers: state.offers.map((offer) =>
          offer._id === offerId ? transformedOffer : offer
        ),
        isLoading: false,
      }));

      return transformedOffer;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating offer",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete an offer
  deleteOffer: async (tailorId, offerId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${BASE_API_URL}/${tailorId}/offers/${offerId}`);

      set((state) => ({
        offers: state.offers.filter((offer) => offer._id !== offerId),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting offer",
        isLoading: false,
      });
      throw error;
    }
  },
}));
