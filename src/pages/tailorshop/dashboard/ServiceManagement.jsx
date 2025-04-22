import { ChevronDown, Eye, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";
import { useAuthStore } from "../../../store/Auth.store";
import { useServiceStore } from "../../../store/Service.store";

const ServiceManagement = () => {
  const { user } = useAuthStore();
  const {
    services,
    predefinedServices,
    fetchServices,
    addServices,
    deleteServices,
    isLoading,
    error: storeError,
  } = useServiceStore();

  const [newService, setNewService] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchServices(user.id);
    }
  }, [user, fetchServices]);

  // Handle service selection
  const handleServiceChange = (e) => {
    setNewService(e.target.value);
  };

  // Validate service
  const validateService = (service) => {
    if (!service) return "Please select a service";
    if (!predefinedServices.includes(service))
      return "Invalid service selected";
    if (services.includes(service)) return "Service already added";
    return null;
  };

  // Add new service
  const handleAddService = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateService(newService);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await addServices(user.id, [newService]);
      setNewService("");
      setSuccess("Service added successfully");
      setTimeout(() => setSuccess(null), 1500);
    } catch (err) {
      setError(storeError || "Error adding service");
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (service) => {
    setSelectedService(service);
    setDeleteModalOpen(true);
  };

  // Confirm service deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteServices(user.id, [selectedService]);
      setDeleteModalOpen(false);
    } catch (err) {
      setError(storeError || "Error deleting service");
    }
  };

  // View service details
  const handleViewService = (service) => {
    setSelectedService(service);
    setViewModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-bold text-gray-800">Service Management</h1>
      <p className="text-xs text-gray-600">
        Manage the services offered by your tailoring business.
      </p>

      {/* Add New Service Form */}
      <div className="my-6">
        <h2 className="text-sm font-medium text-primary mb-4">
          Add New Service
        </h2>
        <form
          onSubmit={handleAddService}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {error && (
            <p className="text-red-600 text-sm col-span-full">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm col-span-full">{success}</p>
          )}
          <div className="relative">
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Select Service
            </label>
            <select
              value={newService}
              onChange={handleServiceChange}
              className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            >
              <option value="">Select Service</option>
              {predefinedServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-[65%] transform -translate-y-1/2 text-gray-500 pointer-events-none"
              size={16}
            />
          </div>
          <div className="flex items-end">
            <CustomButton
              type="submit"
              text={isLoading ? "Adding..." : "Add Service"}
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-full md:w-1/2"
              height="h-9"
            />
          </div>
        </form>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto mt-12">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Service Name
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map((service, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 text-primary text-sm">{service}</td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleViewService(service)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(service)}
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
                <td colSpan="2" className="p-4 text-center text-gray-500">
                  {isLoading ? <Loader /> : "No services found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Service Modal */}
      {viewModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">
                Service Details
              </h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div>
                <h3 className="text-xs font-medium text-gray-500 mb-1">
                  Service Name
                </h3>
                <p className="text-gray-800">{selectedService}</p>
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete the service{" "}
                <span className="font-semibold text-primary">
                  {selectedService}
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

export default ServiceManagement;
