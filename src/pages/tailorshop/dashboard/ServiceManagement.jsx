import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useAuthStore } from "../../../store/Auth.store";
import { useServiceStore } from "../../../store/Service.store";

const ServiceManagement = () => {
  const {
    services,
    predefinedServices,
    fetchServices,
    addServices,
    deleteServices,
  } = useServiceStore();
  const { user } = useAuthStore();
  const [newService, setNewService] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchServices(user.id);
    }
  }, [user, fetchServices]);

  const handleAddService = async () => {
    try {
      await addServices(user.id, [newService]);
      setNewService("");
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const handleDelete = async (service) => {
    try {
      await deleteServices(user.id, [service]);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-6">Service Management</h2>
      <div className="mb-4 flex space-x-2">
        <select
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Service</option>
          {predefinedServices.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddService}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Service
        </button>
      </div>
      <ul className="space-y-2">
        {services.map((service, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>{service}</span>
            <button
              className="text-red-500"
              onClick={() => handleDelete(service)}
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceManagement;
