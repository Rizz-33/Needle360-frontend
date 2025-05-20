import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaEdit, FaFilter, FaSearch, FaStore, FaTrash } from "react-icons/fa";
import { CustomButton } from "../../components/ui/Button";
import SideBarMenu, { useSidebar } from "../../components/ui/SideBarMenu";
import { useAuthStore } from "../../store/Auth.store";
import { useShopStore } from "../../store/Shop.store";

const TailorManagement = () => {
  const { isExpanded } = useSidebar();
  const {
    tailors,
    tailor,
    isLoading,
    error,
    fetchTailors,
    fetchTailorById,
    updateTailor,
  } = useShopStore();
  const { checkAuth } = useAuthStore();

  const [showModal, setShowModal] = useState(false);
  const [editingTailor, setEditingTailor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const initialize = async () => {
      try {
        await checkAuth();
        await fetchTailors();
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };

    initialize();
  }, [checkAuth, fetchTailors]);

  const handleViewTailor = async (tailorId) => {
    try {
      const tailorData = await fetchTailorById(tailorId);
      setEditingTailor(tailorData);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching tailor details:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTailor(null);
  };

  const handleUpdateTailor = async () => {
    try {
      if (!editingTailor?._id) return;

      await updateTailor(editingTailor._id, editingTailor);
      await fetchTailors();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating tailor:", error);
    }
  };

  const filteredTailors = tailors.filter((tailor) => {
    const matchesSearch =
      tailor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tailor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tailor.shopName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "approved" && tailor.isApproved) ||
      (filterStatus === "pending" && !tailor.isApproved);
    return matchesSearch && matchesStatus;
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
              Tailor Management
            </h1>
            <p className="text-xs text-gray-600">
              Manage all registered tailors in the system
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
                  placeholder="Search tailors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending Approval</option>
                </select>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm">
                  <FaFilter className="mr-2" />
                  Filters
                </button>
              </div>
            </div>

            {isLoading && <p>Loading tailors...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tailor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTailors.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No tailors found
                      </td>
                    </tr>
                  ) : (
                    filteredTailors.map((tailor) => (
                      <tr key={tailor._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                              {tailor.name?.charAt(0) || "T"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {tailor.name || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {tailor.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500">
                              <FaStore size={14} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {tailor.shopName || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {tailor.shopAddress || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tailor.contactNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              tailor.isApproved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {tailor.isApproved
                              ? "Approved"
                              : "Pending Approval"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded-full transition-colors"
                              onClick={() => handleViewTailor(tailor._id)}
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

            {filteredTailors.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Showing {filteredTailors.length} of {tailors.length} tailors
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
        {showModal && editingTailor && (
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
                    Tailor Details
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
                        value={editingTailor.name || ""}
                        onChange={(e) =>
                          setEditingTailor({
                            ...editingTailor,
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
                        value={editingTailor.email || ""}
                        onChange={(e) =>
                          setEditingTailor({
                            ...editingTailor,
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
                        value={editingTailor.contactNumber || ""}
                        onChange={(e) =>
                          setEditingTailor({
                            ...editingTailor,
                            contactNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={editingTailor.shopName || ""}
                        onChange={(e) =>
                          setEditingTailor({
                            ...editingTailor,
                            shopName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Address
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={editingTailor.shopAddress || ""}
                        onChange={(e) =>
                          setEditingTailor({
                            ...editingTailor,
                            shopAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Approval Status
                      </label>
                      <div className="flex items-center mt-1">
                        {editingTailor.isApproved ? (
                          <span className="flex items-center text-sm text-green-600">
                            <CheckCircle className="mr-1" size={16} />
                            Approved
                          </span>
                        ) : (
                          <span className="flex items-center text-sm text-yellow-600">
                            <Clock className="mr-1" size={16} />
                            Pending Approval
                          </span>
                        )}
                      </div>
                    </div>
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
                      onClick={handleUpdateTailor}
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

export default TailorManagement;
