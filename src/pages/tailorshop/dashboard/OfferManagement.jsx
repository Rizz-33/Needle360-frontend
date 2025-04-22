import { Edit, Eye, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";
import { useAuthStore } from "../../../store/Auth.store";
import { useOfferStore } from "../../../store/Offer.store";

const OfferManagement = () => {
  const { user } = useAuthStore();
  const {
    offers,
    fetchOffersByTailorId,
    createOffer,
    updateOffer,
    deleteOffer,
    isLoading,
    error: storeError,
  } = useOfferStore();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    percentage: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
  });
  const [editOfferForm, setEditOfferForm] = useState({
    title: "",
    description: "",
    percentage: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchOffersByTailorId(user.id);
    }
  }, [user, fetchOffersByTailorId]);

  // Handle new offer form changes
  const handleNewOfferChange = (e) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({ ...prev, [name]: value }));
  };

  // Handle edit offer form changes
  const handleEditOfferChange = (e) => {
    const { name, value } = e.target;
    setEditOfferForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validate offer data
  const validateOffer = (offer) => {
    if (!offer.title) return "Title is required";
    if (!offer.description) return "Description is required";
    if (
      isNaN(offer.percentage) ||
      offer.percentage <= 0 ||
      offer.percentage > 100
    )
      return "Percentage must be a number between 1 and 100";
    if (!offer.startDate) return "Start date is required";
    if (!offer.endDate) return "End date is required";
    if (new Date(offer.startDate) > new Date(offer.endDate))
      return "End date must be after start date";
    return null;
  };

  // Add new offer
  const handleAddOffer = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateOffer(newOffer);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await createOffer(user.id, {
        ...newOffer,
        percentage: parseFloat(newOffer.percentage),
      });
      setNewOffer({
        title: "",
        description: "",
        percentage: "",
        startDate: "",
        endDate: "",
        imageUrl: "",
      });
      setSuccess("Offer added successfully");
      setTimeout(() => setSuccess(null), 1500);
    } catch (err) {
      setError(storeError || "Error adding offer");
    }
  };

  // Open edit modal
  const handleOpenEditModal = (offer) => {
    setSelectedOffer(offer);
    setEditOfferForm({
      title: offer.title,
      description: offer.description,
      percentage: offer.percentage.toString(),
      startDate: offer.startDate
        ? offer.startDate.toISOString().split("T")[0]
        : "",
      endDate: offer.endDate ? offer.endDate.toISOString().split("T")[0] : "",
      imageUrl: offer.imageUrl || "",
    });
    setEditModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  // Update offer
  const handleUpdateOffer = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateOffer(editOfferForm);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await updateOffer(user.id, selectedOffer._id, {
        ...editOfferForm,
        percentage: parseFloat(editOfferForm.percentage),
      });
      setSuccess("Offer updated successfully");
      setTimeout(() => {
        setEditModalOpen(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError(storeError || "Error updating offer");
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (offer) => {
    setSelectedOffer(offer);
    setDeleteModalOpen(true);
  };

  // Confirm offer deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteOffer(user.id, selectedOffer._id);
      setDeleteModalOpen(false);
    } catch (err) {
      setError(storeError || "Error deleting offer");
    }
  };

  // View offer details
  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
    setViewModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-bold text-gray-800">Offer Management</h1>
      <p className="text-xs text-gray-600">
        Manage your promotional offers and discounts.
      </p>

      {/* Add New Offer Form */}
      <div className="my-6">
        <h2 className="text-sm font-medium text-primary mb-4">Add New Offer</h2>
        <form
          onSubmit={handleAddOffer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {error && (
            <p className="text-red-600 text-sm col-span-full">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm col-span-full">{success}</p>
          )}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={newOffer.title}
              onChange={handleNewOfferChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., Summer Sale"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Description
            </label>
            <textarea
              name="description"
              value={newOffer.description}
              onChange={handleNewOfferChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Describe the offer"
              rows="1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Discount Percentage
            </label>
            <input
              type="number"
              name="percentage"
              value={newOffer.percentage}
              onChange={handleNewOfferChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., 20"
              min="1"
              max="100"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={newOffer.startDate}
              onChange={handleNewOfferChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={newOffer.endDate}
              onChange={handleNewOfferChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Image URL (Optional)
            </label>
            <input
              type="text"
              name="imageUrl"
              value={newOffer.imageUrl}
              onChange={handleNewOfferChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., https://example.com/image.jpg"
            />
          </div>
          <div className="flex items-end col-span-full">
            <CustomButton
              type="submit"
              text={isLoading ? "Adding..." : "Add Offer"}
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-full md:w-1/4"
              height="h-9"
            />
          </div>
        </form>
      </div>

      {/* Offers Table */}
      <div className="overflow-x-auto mt-12">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {offers.length > 0 ? (
              offers.map((offer) => (
                <tr key={offer._id} className="border-b">
                  <td className="p-2 text-primary text-sm">{offer.title}</td>
                  <td className="p-2 text-gray-800 text-sm">
                    {offer.percentage}%
                  </td>
                  <td className="p-2 text-gray-800 text-sm">
                    {offer.startDate?.toLocaleDateString()}
                  </td>
                  <td className="p-2 text-gray-800 text-sm">
                    {offer.endDate?.toLocaleDateString()}
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleViewOffer(offer)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(offer)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(offer)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  {isLoading ? <Loader /> : "No offers found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Offer Modal */}
      {viewModalOpen && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Offer Details</h2>
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
                  <p className="text-gray-800">{selectedOffer._id}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Title
                  </h3>
                  <p className="text-gray-800">{selectedOffer.title}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Description
                  </h3>
                  <p className="text-gray-800">{selectedOffer.description}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Discount
                  </h3>
                  <p className="text-gray-800">{selectedOffer.percentage}%</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Start Date
                  </h3>
                  <p className="text-gray-800">
                    {selectedOffer.startDate?.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    End Date
                  </h3>
                  <p className="text-gray-800">
                    {selectedOffer.endDate?.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Image URL
                  </h3>
                  <p className="text-gray-800">
                    {selectedOffer.imageUrl || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Created At
                  </h3>
                  <p className="text-gray-800">
                    {new Date(selectedOffer.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Updated At
                  </h3>
                  <p className="text-gray-800">
                    {new Date(selectedOffer.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedOffer.imageUrl && (
                <div className="mt-6">
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Image
                  </h3>
                  <img
                    src={selectedOffer.imageUrl}
                    alt={selectedOffer.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/150")
                    }
                  />
                </div>
              )}
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

      {/* Edit Offer Modal */}
      {editModalOpen && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Edit Offer</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateOffer}>
              <div className="p-6 space-y-4">
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Offer ID
                  </label>
                  <input
                    type="text"
                    value={selectedOffer._id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl bg-gray-50 text-primary/75"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editOfferForm.title}
                    onChange={handleEditOfferChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., Summer Sale"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editOfferForm.description}
                    onChange={handleEditOfferChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Describe the offer"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    name="percentage"
                    value={editOfferForm.percentage}
                    onChange={handleEditOfferChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., 20"
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={editOfferForm.startDate}
                    onChange={handleEditOfferChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={editOfferForm.endDate}
                    onChange={handleEditOfferChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={editOfferForm.imageUrl}
                    onChange={handleEditOfferChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="border-t px-6 py-4 flex justify-end space-x-3">
                <CustomButton
                  onClick={() => setEditModalOpen(false)}
                  text="Cancel"
                  color="primary"
                  hover_color="hoverAccent"
                  variant="outlined"
                  width="w-1/3"
                  height="h-9"
                />
                <CustomButton
                  type="submit"
                  text={isLoading ? "Saving..." : "Save Changes"}
                  color="primary"
                  hover_color="hoverAccent"
                  variant="filled"
                  width="w-1/3"
                  height="h-9"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete the offer{" "}
                <span className="font-semibold text-primary">
                  {selectedOffer.title}
                </span>
                ? <br />
                <br />
                This action cannot be undone.
              </p>
            </div>
            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <CustomButton
                onClick={() => setDeleteModalOpen(false)}
                text="Cancel"
                color="primary"
                hover_color="hoverAccent"
                variant="outlined"
                width="w-1/3"
                height="h-9"
              />
              <CustomButton
                onClick={handleConfirmDelete}
                text="Delete"
                color="danger"
                hover_color="hoverAccent"
                variant="filled"
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

export default OfferManagement;
