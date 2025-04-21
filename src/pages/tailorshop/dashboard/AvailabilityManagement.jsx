import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useAuthStore } from "../../../store/Auth.store";
import { useAvailabilityStore } from "../../../store/Availability.store";

const AvailabilityManagement = () => {
  const {
    availabilitySlots,
    fetchTailorAvailability,
    createBulkAvailability,
    deleteBulkAvailability,
  } = useAvailabilityStore();
  const { user } = useAuthStore();
  const [newSlot, setNewSlot] = useState({
    day: "Monday",
    from: "09:00",
    to: "17:00",
    isOpen: true,
  });

  useEffect(() => {
    if (user?.id) {
      fetchTailorAvailability(user.id);
    }
  }, [user, fetchTailorAvailability]);

  const handleAddSlot = async () => {
    try {
      await createBulkAvailability(user.id, [newSlot]);
      setNewSlot({ day: "Monday", from: "09:00", to: "17:00", isOpen: true });
    } catch (error) {
      console.error("Error adding slot:", error);
    }
  };

  const handleDelete = async (slotId) => {
    try {
      await deleteBulkAvailability(user.id, [slotId]);
    } catch (error) {
      console.error("Error deleting slot:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-6">Availability Management</h2>
      <div className="mb-4 flex space-x-2">
        <select
          value={newSlot.day}
          onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
          className="p-2 border rounded"
        >
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <input
          type="time"
          value={newSlot.from}
          onChange={(e) => setNewSlot({ ...newSlot, from: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="time"
          value={newSlot.to}
          onChange={(e) => setNewSlot({ ...newSlot, to: e.target.value })}
          className="p-2 border rounded"
        />
        <button
          onClick={handleAddSlot}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Slot
        </button>
      </div>
      <ul className="space-y-2">
        {availabilitySlots.map((slot) => (
          <li
            key={slot._id}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>{`${slot.day}: ${slot.from} - ${slot.to}`}</span>
            <button
              className="text-red-500"
              onClick={() => handleDelete(slot._id)}
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailabilityManagement;
