import { ChevronDown, Edit, Eye, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";
import { useAuthStore } from "../../../store/Auth.store";
import { useAvailabilityStore } from "../../../store/Availability.store";

const AvailabilityManagement = () => {
  const { user } = useAuthStore();
  const {
    availabilitySlots,
    fetchTailorAvailability,
    createBulkAvailability,
    updateBulkAvailability,
    deleteBulkAvailability,
    validateTimeFormat,
    isLoading,
    error: storeError,
  } = useAvailabilityStore();

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [newSlot, setNewSlot] = useState({
    day: "Monday",
    from: "09:00",
    to: "17:00",
    isOpen: true,
  });
  const [editSlot, setEditSlot] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchTailorAvailability(user.id);
    }
  }, [user, fetchTailorAvailability]);

  // Handle new slot form changes
  const handleNewSlotChange = (e) => {
    const { name, value } = e.target;
    setNewSlot((prev) => ({ ...prev, [name]: value }));
  };

  // Handle edit slot form changes
  const handleEditSlotChange = (e) => {
    const { name, value } = e.target;
    setEditSlot((prev) => ({ ...prev, [name]: value }));
  };

  // Validate slot data
  const validateSlot = (slot) => {
    if (!slot.day || !daysOfWeek.includes(slot.day))
      return "Please select a valid day";
    if (!validateTimeFormat(slot.from)) return "Invalid start time format";
    if (!validateTimeFormat(slot.to)) return "Invalid end time format";
    if (slot.from >= slot.to) return "End time must be after start time";
    const slotExists = availabilitySlots.some(
      (existingSlot) =>
        existingSlot.day === slot.day &&
        existingSlot.from === slot.from &&
        existingSlot.to === slot.to
    );
    if (slotExists) return "This availability slot already exists";
    return null;
  };

  // Add new slot
  const handleAddSlot = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateSlot(newSlot);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await createBulkAvailability(user.id, [newSlot]);
      setNewSlot({ day: "Monday", from: "09:00", to: "17:00", isOpen: true });
      setSuccess("Availability slot added successfully");
      setTimeout(() => setSuccess(null), 1500);
    } catch (err) {
      setError(storeError || "Error adding availability slot");
    }
  };

  // Open edit modal
  const handleOpenEditModal = (slot) => {
    setSelectedSlot(slot);
    setEditSlot({
      day: slot.day,
      from: slot.from,
      to: slot.to,
      isOpen: slot.isOpen,
    });
    setEditModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  // Update slot
  const handleUpdateSlot = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateSlot(editSlot);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await updateBulkAvailability(user.id, [
        { _id: selectedSlot._id, ...editSlot },
      ]);
      setSuccess("Availability slot updated successfully");
      setTimeout(() => {
        setEditModalOpen(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError(storeError || "Error updating availability slot");
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (slot) => {
    setSelectedSlot(slot);
    setDeleteModalOpen(true);
  };

  // Confirm slot deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteBulkAvailability(user.id, [selectedSlot._id]);
      setDeleteModalOpen(false);
    } catch (err) {
      setError(storeError || "Error deleting availability slot");
    }
  };

  // View slot details
  const handleViewSlot = (slot) => {
    setSelectedSlot(slot);
    setViewModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-bold text-gray-800">
        Availability Management
      </h1>
      <p className="text-xs text-gray-600">
        Manage your availability schedule for client appointments.
      </p>

      {/* Add New Slot Form */}
      <div className="my-6">
        <h2 className="text-sm font-medium text-primary mb-4">
          Add New Availability Slot
        </h2>
        <form
          onSubmit={handleAddSlot}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {error && (
            <p className="text-red-600 text-sm col-span-full">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm col-span-full">{success}</p>
          )}
          <div className="relative">
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Day
            </label>
            <select
              name="day"
              value={newSlot.day}
              onChange={handleNewSlotChange}
              className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-[65%] transform -translate-y-1/2 text-gray-500 pointer-events-none"
              size={16}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Start Time
            </label>
            <input
              type="time"
              name="from"
              value={newSlot.from}
              onChange={handleNewSlotChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              End Time
            </label>
            <input
              type="time"
              name="to"
              value={newSlot.to}
              onChange={handleNewSlotChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex items-end col-span-full">
            <CustomButton
              type="submit"
              text={isLoading ? "Adding..." : "Add Slot"}
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-full md:w-1/4"
              height="h-9"
            />
          </div>
        </form>
      </div>

      {/* Slots Table */}
      <div className="overflow-x-auto mt-12">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {availabilitySlots.length > 0 ? (
              availabilitySlots.map((slot) => (
                <tr key={slot._id} className="border-b">
                  <td className="p-2 text-primary text-sm">{slot.day}</td>
                  <td className="p-2 text-gray-800 text-sm">{slot.from}</td>
                  <td className="p-2 text-gray-800 text-sm">{slot.to}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                        slot.isOpen
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span
                        className={`${
                          slot.isOpen ? "text-green-800" : "text-red-800"
                        } text-sm`}
                      >
                        ●
                      </span>
                      {slot.isOpen ? "Open" : "Closed"}
                    </span>
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleViewSlot(slot)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(slot)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(slot)}
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
                  {isLoading ? <Loader /> : "No availability slots found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Slot Modal */}
      {viewModalOpen && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">
                Availability Slot Details
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
                  <p className="text-gray-800">{selectedSlot._id}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Day
                  </h3>
                  <p className="text-gray-800">{selectedSlot.day}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Start Time
                  </h3>
                  <p className="text-gray-800">{selectedSlot.from}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    End Time
                  </h3>
                  <p className="text-gray-800">{selectedSlot.to}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Status
                  </h3>
                  <p className="text-gray-800">
                    {selectedSlot.isOpen ? "Open" : "Closed"}
                  </p>
                </div>
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

      {/* Edit Slot Modal */}
      {editModalOpen && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">
                Edit Availability Slot
              </h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateSlot}>
              <div className="p-6 space-y-4">
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Slot ID
                  </label>
                  <input
                    type="text"
                    value={selectedSlot._id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl bg-gray-50 text-primary/75"
                  />
                </div>
                <div className="relative">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Day
                  </label>
                  <select
                    name="day"
                    value={editSlot.day}
                    onChange={handleEditSlotChange}
                    className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-2 top-[65%] transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={16}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="from"
                    value={editSlot.from}
                    onChange={handleEditSlotChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="to"
                    value={editSlot.to}
                    onChange={handleEditSlotChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Status
                  </label>
                  <select
                    name="isOpen"
                    value={editSlot.isOpen}
                    onChange={handleEditSlotChange}
                    className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                  >
                    <option value={true}>Open</option>
                    <option value={false}>Closed</option>
                  </select>
                  <ChevronDown
                    className="absolute right-2 top-[85%] transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={16}
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
      {deleteModalOpen && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete the availability slot for{" "}
                <span className="font-semibold text-primary">
                  {selectedSlot.day} from {selectedSlot.from} to{" "}
                  {selectedSlot.to}
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

export default AvailabilityManagement;
