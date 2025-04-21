import React, { useEffect } from "react";
import { useAuthStore } from "../../../store/Auth.store";
import { useCustomerStore } from "../../../store/Customer.store";
import { useUserInteractionStore } from "../../../store/UserInteraction.store";

const CustomerManagement = () => {
  const { customers, fetchCustomers } = useCustomerStore();
  const { followers, getFollowers } = useUserInteractionStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCustomers();
    if (user?.id) {
      getFollowers(user.id);
    }
  }, [fetchCustomers, getFollowers, user]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-6">Customer Management</h2>
      <div className="mb-4">
        <h3 className="text-md font-semibold">
          Followers ({followers.length})
        </h3>
        <ul className="space-y-2">
          {followers.map((follower) => (
            <li key={follower._id} className="p-2 border-b">
              {follower.name} ({follower.email})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-md font-semibold">
          All Customers ({customers.length})
        </h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Contact</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-b">
                <td className="p-2">{customer.name}</td>
                <td className="p-2">{customer.email}</td>
                <td className="p-2">{customer.contactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerManagement;
