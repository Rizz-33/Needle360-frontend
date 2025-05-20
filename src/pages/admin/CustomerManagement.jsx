import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaEdit, FaFilter, FaSearch, FaTrash } from "react-icons/fa";
import { CustomButton } from "../../components/ui/Button";
import SideBarMenu, { useSidebar } from "../../components/ui/SideBarMenu";
import { useAuthStore } from "../../store/Auth.store";
import { useCustomerStore } from "../../store/Customer.store";

const CustomerManagement = () => {
  const { isExpanded } = useSidebar();
  const {
    customers,
    customer,
    isLoading,
    error,
    fetchCustomers,
    fetchCustomerById,
    updateCustomer,
  } = useCustomerStore();
  const { checkAuth } = useAuthStore();

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    const initialize = async () => {
      try {
        await checkAuth();
        await fetchCustomers();
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };

    initialize();
  }, [checkAuth, fetchCustomers]);

  const handleViewCustomer = async (customerId) => {
    try {
      const customerData = await fetchCustomerById(customerId);
      setEditingCustomer(customerData);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleUpdateCustomer = async () => {
    try {
      if (!editingCustomer?._id) return;

      await updateCustomer(editingCustomer._id, editingCustomer);
      await fetchCustomers();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || customer.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex w-full bg-blue-50">
      <SideBarMenu />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out`}
        style={{
          marginLeft: isExpanded ? "calc(240px + 8px)" : "calc(60px + 8px)",
        }}
      >
        <main className="pt-16 pb-8 w-full px-12 overflow-auto h-screen">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-800">
              Customer Management
            </h1>
            <p className="text-xs text-gray-600">
              Manage all registered customers in the system
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-1/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="user">Customers</option>
                  <option value="admin">Admins</option>
                </select>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm">
                  <FaFilter className="mr-2" />
                  Filters
                </button>
              </div>
            </div>

            {isLoading && <p>Loading customers...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                              {customer.name?.charAt(0) || "C"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.name || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.contactNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              customer.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {customer.role === "admin" ? "Admin" : "Customer"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded-full transition-colors"
                              onClick={() => handleViewCustomer(customer._id)}
                              title="View/Edit"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded-full transition-colors"
                              title="Delete"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredCustomers.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Showing {filteredCustomers.length} of {customers.length}{" "}
                  customers
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-xs">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-xs bg-primary text-white">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-xs">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showModal && editingCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-3/4 overflow-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    Customer Details
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={editingCustomer.name || ""}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={editingCustomer.email || ""}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={editingCustomer.contactNumber || ""}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            contactNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={editingCustomer.role || "user"}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            role: e.target.value,
                          })
                        }
                      >
                        <option value="user">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      value={editingCustomer.address || ""}
                      onChange={(e) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <CustomButton
                      onClick={handleCloseModal}
                      text="Cancel"
                      color="primary"
                      hover_color="hoverAccent"
                      variant="outlined"
                      width="w-1/3"
                      height="h-9"
                    />
                    <CustomButton
                      onClick={handleUpdateCustomer}
                      text="Save Changes"
                      color="primary"
                      hover_color="hoverAccent"
                      variant="filled"
                      width="w-1/3"
                      height="h-9"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerManagement;
