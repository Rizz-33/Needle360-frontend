import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Eye, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomButton } from "../../components/ui/Button";
import SideBarMenu, { useSidebar } from "../../components/ui/SideBarMenu";
import { useShopStore } from "../../store/Shop.store";

const TailorRequest = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { isExpanded } = useSidebar();
  const {
    unapprovedTailors,
    fetchUnapprovedTailors,
    fetchUnapprovedTailorById,
    unapprovedTailor,
    isLoading,
    error,
    updateTailor,
    fetchTailors,
  } = useShopStore();

  const [selectedTailor, setSelectedTailor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approving, setApproving] = useState(false);

  // Fetch unapproved tailors on component mount
  useEffect(() => {
    fetchUnapprovedTailors();
  }, [fetchUnapprovedTailors]);

  // Listen for sidebar expansion state changes
  useEffect(() => {
    const handleSidebarChange = (e) => {
      setSidebarExpanded(e.detail.expanded);
    };

    window.addEventListener("sidebarStateChange", handleSidebarChange);
    return () =>
      window.removeEventListener("sidebarStateChange", handleSidebarChange);
  }, []);

  const handleViewTailor = async (tailor) => {
    setShowModal(true); // Open the modal immediately

    try {
      // Fetch detailed unapproved tailor information
      const detailedTailor = await useShopStore
        .getState()
        .fetchUnapprovedTailorById(tailor.id);

      // Merge the detailed data with the initial tailor data
      setSelectedTailor((prev) => ({
        ...prev,
        ...detailedTailor,
      }));
    } catch (error) {
      console.error("Error fetching unapproved tailor details:", error);
      alert("Failed to fetch tailor details");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTailor(null); // Clear selected tailor when closing
  };

  const handleApproveTailor = async (tailorId) => {
    try {
      setApproving(true);

      // Call the update API with approval status
      await updateTailor(tailorId, {
        status: "approved",
        approved: true,
      });

      // Refresh both approved and unapproved tailor lists
      await fetchTailors();
      await fetchUnapprovedTailors();

      // Success message
      alert("Tailor approved successfully");

      // Close modal
      setShowModal(false);
    } catch (error) {
      console.error("Error approving tailor:", error);
      alert(`Failed to approve tailor: ${error.message || "Unknown error"}`);
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="flex w-full bg-blue-50">
      {/* Sidebar component */}
      <SideBarMenu />

      {/* Main content area that responds to sidebar state */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out`}
        style={{
          marginLeft: isExpanded ? "calc(240px + 8px)" : "calc(60px + 8px)",
        }}
      >
        {/* Main content with padding to account for the header */}
        <main className="pt-16 pb-8 w-full px-12 overflow-auto h-screen">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-800">
              Pending Tailor Registrations
            </h1>
            <p className="text-xs text-gray-600">
              Below are the details of newly registered tailors who have not
              been approved yet. Please review their information and approve
              them as needed. Click on any request to view more details or
              update its status.
            </p>
          </div>

          {/* Loading and error handling */}
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Shop Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unapprovedTailors.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No pending tailor requests found
                      </td>
                    </tr>
                  ) : (
                    unapprovedTailors.map((tailor) => (
                      <tr key={tailor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{tailor.registrationNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tailor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tailor.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tailor.shopName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending Approval
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded-full transition-colors"
                              onClick={() => handleViewTailor(tailor)}
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded-full transition-colors"
                              onClick={() => handleViewTailor(tailor)} // Call handleViewTailor instead
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {unapprovedTailors.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Showing {unapprovedTailors.length} of{" "}
                  {unapprovedTailors.length} requests
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

      {/* Modal for detailed tailor view - Modified to remove bio and services */}
      <AnimatePresence>
        {showModal && selectedTailor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-3/4 overflow-auto"
            >
              <div className="p-4">
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
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-md font-semibold mb-1 text-gray-700 border-b pb-1">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500">ID</p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor._id || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Full Name
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Email Address
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Phone Number
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor.contactNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Role
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor.role || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Created At
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor.createdAt
                            ? new Date(
                                selectedTailor.createdAt
                              ).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Verification Status
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor.isVerified
                            ? "Verified"
                            : "Not Verified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div>
                    <h3 className="text-md font-semibold mb-1 text-gray-700 border-b pb-1">
                      Business Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Shop Name
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor.shopName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Shop Address
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor.shopAddress || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Shop Registration Number
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor.shopRegistrationNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Logo
                        </p>
                        {selectedTailor.logoUrl ? (
                          <img
                            src={selectedTailor.logoUrl}
                            alt="Tailor Logo"
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        ) : (
                          <p className="text-sm text-gray-800">
                            {selectedTailor.logoUrl || "Not available"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Banking Information */}
                  <div>
                    <h3 className="text-md font-semibold mb-1 text-gray-700 border-b pb-1">
                      Banking Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Bank Account Number
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor.bankAccountNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Bank Name
                        </p>
                        <p className="text-sm text-gray-800">
                          {selectedTailor.bankName || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-3 border-t">
                    <CustomButton
                      onClick={handleCloseModal}
                      text="Cancel"
                      color="primary"
                      hover_color="hoverAccent"
                      variant="outlined"
                      width="w-1/3"
                      height="h-9"
                      type="submit"
                    />
                    <CustomButton
                      onClick={() => handleApproveTailor(selectedTailor.id)}
                      disabled={approving}
                      text={approving ? "Processing..." : "Approve Tailor"}
                      color="primary"
                      hover_color="hoverAccent"
                      variant="filled"
                      width="w-1/3"
                      height="h-9"
                      type="submit"
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

export default TailorRequest;
