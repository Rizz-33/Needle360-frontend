import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.API_URL || "http://localhost:4000"
}/api/user`;

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add axios interceptors for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const useUserStore = create((set, get) => ({
  users: [],
  user: null,
  isLoading: false,
  error: null,

  // Fetch all users
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/users`);
      console.log("API Response:", response.data);

      const userData = response.data
        .map((user) => ({
          _id: user._id, // Ensure _id is included
          email: user.email,
          name: user.name,
          contactNumber: user.contactNumber,
          address: user.address,
          followers: user.followers,
          following: user.following,
        }))
        .filter((user) => user.email); // Filtering out any null or undefined emails

      // Update the state
      set({ users: userData });
      return userData;
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ error: error.response?.data?.message || "Failed to load users" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a user by ID
  fetchUserById: async (id) => {
    // Don't proceed if id is undefined
    if (!id || id === "undefined") {
      set({ error: "Invalid user ID", user: null });
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/users/${id}`);
      set({ user: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      set({
        error: error.response?.data?.message || "Failed to load user",
        user: null,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update a user by ID
  updateUser: async (id, updateData) => {
    if (!id || id === "undefined") {
      set({ error: "Invalid user ID" });
      throw new Error("Invalid user ID");
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_API_URL}/users/${id}`,
        updateData
      );
      console.log("Update Response:", response.data);

      // Update the current user if it's the one being edited
      if (get().user && get().user._id === id) {
        set({ user: response.data });
      }

      // Update the user in the users list if present
      const updatedUsers = get().users.map((user) =>
        user._id === id ? { ...user, ...updateData } : user
      );

      set({ users: updatedUsers });
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      set({
        error: error.response?.data?.message || "Failed to update user",
      });
      throw error; // Rethrow to allow handling in the component
    } finally {
      set({ isLoading: false });
    }
  },

  // Get user reviews
  fetchUserReviews: async (id) => {
    if (!id || id === "undefined") {
      set({ error: "Invalid user ID" });
      throw new Error("Invalid user ID");
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/users/${id}/reviews`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      set({
        error: error.response?.data?.message || "Failed to load user reviews",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
