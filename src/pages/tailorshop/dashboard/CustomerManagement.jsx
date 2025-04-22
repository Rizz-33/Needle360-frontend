import { Eye, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";
import { useAuthStore } from "../../../store/Auth.store";
import { useCustomerStore } from "../../../store/Customer.store";
import { useUserInteractionStore } from "../../../store/UserInteraction.store";

const CustomerManagement = () => {
  const { user } = useAuthStore();
  const {
    customers,
    fetchCustomers,
    isLoading: customerLoading,
    error: customerError,
  } = useCustomerStore();
  const {
    followers,
    getFollowers,
    isLoading: followerLoading,
    error: followerError,
  } = useUserInteractionStore();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [personType, setPersonType] = useState(""); // "follower" or "customer"

  useEffect(() => {
    fetchCustomers();
    if (user?.id) {
      getFollowers(user.id);
    }
  }, [fetchCustomers, getFollowers, user]);

  // Handle view details
  const handleViewPerson = (person, type) => {
    setSelectedPerson(person);
    setPersonType(type);
    setViewModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-bold text-gray-800">Customer Management</h1>
      <p className="text-xs text-gray-600">
        View and manage your followers and customers.
      </p>

      {/* Followers Section */}
      <div className="my-6">
        <h2 className="text-sm font-medium text-primary mb-4">
          Followers ({followers.length})
        </h2>
        {followerError && (
          <p className="text-red-600 text-sm mb-4">{followerError}</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {followerLoading ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    <Loader />
                  </td>
                </tr>
              ) : followers.length > 0 ? (
                followers.map((follower) => (
                  <tr key={follower._id} className="border-b">
                    <td className="p-2 text-primary text-sm">
                      {follower.name}
                    </td>
                    <td className="p-2 text-gray-800 text-sm">
                      {follower.email}
                    </td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => handleViewPerson(follower, "follower")}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded-full transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No followers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customers Section */}
      <div className="my-6">
        <h2 className="text-sm font-medium text-primary mb-4">
          All Customers ({customers.length})
        </h2>
        {customerError && (
          <p className="text-red-600 text-sm mb-4">{customerError}</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customerLoading ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    <Loader />
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer._id} className="border-b">
                    <td className="p-2 text-primary text-sm">
                      {customer.name}
                    </td>
                    <td className="p-2 text-gray-800 text-sm">
                      {customer.email}
                    </td>
                    <td className="p-2 text-gray-800 text-sm">
                      {customer.contactNumber}
                    </td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => handleViewPerson(customer, "customer")}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded-full transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Person Modal */}
      {viewModalOpen && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">
                {personType === "follower"
                  ? "Follower Details"
                  : "Customer Details"}
              </h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">ID</h3>
                  <p className="text-gray-800">{selectedPerson._id}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Name
                  </h3>
                  <p className="text-gray-800">{selectedPerson.name}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Email
                  </h3>
                  <p className="text-gray-800">{selectedPerson.email}</p>
                </div>
                {personType === "customer" && (
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 mb-1">
                      Contact Number
                    </h3>
                    <p className="text-gray-800">
                      {selectedPerson.contactNumber || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end">
              <CustomButton
                onClick={() => setViewModalOpen(false)}
                text="Close"
                color="primary"
                hover_color="hoverAccent"
                variant="outlined"
                width="w-1/3"
                height="h-9"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
