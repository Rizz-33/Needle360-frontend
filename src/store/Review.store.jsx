import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:4000"
}/api/review`;

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useReviewStore = create((set, get) => ({
  reviews: [],
  isLoading: false,
  error: null,

  // Fetch all reviews for a specific user
  fetchUserReviews: async (userId) => {
    if (!userId) {
      return set({
        error: "User ID is required",
        isLoading: false,
      });
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/${userId}/reviews`);
      set({ reviews: response.data.reviews || [], isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching reviews",
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch a specific review by ID
  fetchReviewById: async (userId, reviewId) => {
    if (!userId || !reviewId) {
      return set({
        error: "User ID and Review ID are required",
        isLoading: false,
      });
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${BASE_API_URL}/${userId}/reviews/${reviewId}`
      );
      set({ isLoading: false });
      return response.data.review;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching review",
        isLoading: false,
      });
      throw error;
    }
  },

  // Create a new review
  createReview: async (userId, reviewData) => {
    if (!userId || !reviewData || !reviewData.clientId || !reviewData.rating) {
      return set({
        error: "User ID, client ID, and rating are required",
        isLoading: false,
      });
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${BASE_API_URL}/${userId}/reviews`,
        reviewData
      );

      // Update the local reviews array with the new review
      set((state) => ({
        reviews: [...state.reviews, response.data.review],
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating review",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update an existing review
  updateReview: async (userId, reviewId, reviewData) => {
    if (!userId || !reviewId) {
      return set({
        error: "User ID and Review ID are required",
        isLoading: false,
      });
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_API_URL}/${userId}/reviews/${reviewId}`,
        reviewData
      );

      // Update the review in the local reviews array
      set((state) => ({
        reviews: state.reviews.map((review) =>
          review._id === reviewId ? response.data.review : review
        ),
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating review",
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (userId, reviewId) => {
    if (!userId || !reviewId) {
      return set({
        error: "User ID and Review ID are required",
        isLoading: false,
      });
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/${userId}/reviews/${reviewId}`
      );

      // Remove the deleted review from the local reviews array
      set((state) => ({
        reviews: state.reviews.filter((review) => review._id !== reviewId),
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting review",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get reviews without API call (from local state)
  getLocalReviews: () => {
    return get().reviews;
  },

  // Clear reviews when needed (e.g., on logout)
  clearReviews: () => {
    set({ reviews: [], error: null });
  },
}));
