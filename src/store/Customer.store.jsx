import axios from "axios";
import { create } from "zustand";

const BASE_API_URL = `${
  import.meta.env.API_URL || "http://localhost:4000"
}/api/customer`;

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

export const useCustomerStore = create((set, get) => ({
  customers: [],
  customer: null,
  isLoading: false,
  error: null,

  // Fetch all customers
  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/customers`);
      console.log("API Response:", response.data);

      const customerData = response.data
        .map((customer) => ({
          _id: customer._id, // Ensure _id is included
          email: customer.email,
          name: customer.name,
          contactNumber: customer.contactNumber,
          address: customer.address,
          followers: customer.followers,
          following: customer.following,
        }))
        .filter((customer) => customer.email); // Filtering out any null or undefined emails

      // Update the state
      set({ customers: customerData });
      return customerData;
    } catch (error) {
      console.error("Error fetching customers:", error);
      set({
        error: error.response?.data?.message || "Failed to load customers",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a customer by ID
  fetchCustomerById: async (id) => {
    // Don't proceed if id is undefined
    if (!id || id === "undefined") {
      set({ error: "Invalid customer ID", customer: null });
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${BASE_API_URL}/customers/${id}`);
      set({ customer: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      set({
        error: error.response?.data?.message || "Failed to load customer",
        customer: null,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update a customer by ID
  updateCustomer: async (id, updateData) => {
    if (!id || id === "undefined") {
      set({ error: "Invalid customer ID" });
      throw new Error("Invalid customer ID");
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${BASE_API_URL}/customers/${id}`,
        updateData
      );
      console.log("Update Response:", response.data);

      // Update the current customer if it's the one being edited
      if (get().customer && get().customer._id === id) {
        set({ customer: response.data });
      }

      // Update the customer in the customers list if present
      const updatedCustomers = get().customers.map((customer) =>
        customer._id === id ? { ...customer, ...updateData } : customer
      );

      set({ customers: updatedCustomers });
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
      set({
        error: error.response?.data?.message || "Failed to update customer",
      });
      throw error; // Rethrow to allow handling in the component
    } finally {
      set({ isLoading: false });
    }
  },

  // Get customer reviews
  fetchCustomerReviews: async (id) => {
    if (!id || id === "undefined") {
      set({ error: "Invalid customer ID" });
      throw new Error("Invalid customer ID");
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${BASE_API_URL}/customers/${id}/reviews`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer reviews:", error);
      set({
        error:
          error.response?.data?.message || "Failed to load customer reviews",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
