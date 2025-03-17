import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.API_URL || "http://localhost:4000"
}/api/user-interactions`;

export const useUserInteractionStore = create((set, get) => ({
  followers: [],
  following: [],
  error: null,
  isLoading: false,
  isFollowing: false,

  followUser: async (followerId, followeeId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${BASE_API_URL}/follow`, {
        followerId,
        followeeId,
      });

      // Update the following list
      const { following } = get();
      const updatedFollowing = [...following];

      // Check if we already have this user's info to add
      const existingUserIndex = following.findIndex(
        (user) => user._id === followeeId || user.id === followeeId
      );

      if (existingUserIndex === -1) {
        // We'll need to fetch the user's details to add them to the list
        try {
          const userResponse = await axios.get(
            `${
              import.meta.env.API_URL || "http://localhost:4000"
            }/api/users/${followeeId}`
          );
          updatedFollowing.push(userResponse.data);
        } catch (error) {
          console.error("Error fetching followed user details:", error);
        }
      }

      set({
        following: updatedFollowing,
        isFollowing: true,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to follow user";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  unfollowUser: async (followerId, followeeId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${BASE_API_URL}/unfollow`, {
        followerId,
        followeeId,
      });

      // Update the following list by removing the unfollowed user
      const { following } = get();
      const updatedFollowing = following.filter(
        (user) => user._id !== followeeId && user.id !== followeeId
      );

      set({
        following: updatedFollowing,
        isFollowing: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to unfollow user";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getFollowers: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${BASE_API_URL}/${userId}/followers`);
      set({ followers: response.data, error: null });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to get followers";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getFollowing: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${BASE_API_URL}/${userId}/following`);
      set({ following: response.data, error: null });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to get following users";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  checkIfFollowing: async (followerId, followeeId) => {
    try {
      set({ isLoading: true, error: null });

      // First check if we already have the following list loaded
      const { following } = get();
      if (following.length > 0) {
        const isFollowing = following.some(
          (user) => user._id === followeeId || user.id === followeeId
        );
        set({ isFollowing });
        return isFollowing;
      }

      // If not, fetch the following list first
      await get().getFollowing(followerId);
      const updatedFollowing = get().following;

      const isFollowing = updatedFollowing.some(
        (user) => user._id === followeeId || user.id === followeeId
      );

      set({ isFollowing });
      return isFollowing;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to check following status";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  resetState: () => {
    set({
      followers: [],
      following: [],
      error: null,
      isLoading: false,
      isFollowing: false,
    });
  },
}));
