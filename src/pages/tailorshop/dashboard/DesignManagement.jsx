import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { predefinedServices } from "../../../configs/Services.configs";
import { useAuthStore } from "../../../store/Auth.store";
import { useDesignStore } from "../../../store/Design.store";

const DesignManagement = () => {
  const {
    designs,
    fetchTailorDesignsById,
    createTailorDesign,
    deleteTailorDesign,
  } = useDesignStore();
  const { user } = useAuthStore();
  const [newDesign, setNewDesign] = useState({
    title: "",
    description: "",
    price: 0,
    tags: [],
    imageUrl: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchTailorDesignsById(user.id);
    }
  }, [user, fetchTailorDesignsById]);

  const handleAddDesign = async () => {
    try {
      await createTailorDesign(user.id, newDesign);
      setNewDesign({
        title: "",
        description: "",
        price: 0,
        tags: [],
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error adding design:", error);
    }
  };

  const handleDelete = async (designId) => {
    try {
      await deleteTailorDesign(user.id, designId);
    } catch (error) {
      console.error("Error deleting design:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-6">Design Management</h2>
      <div className="mb-4 flex flex-col space-y-2">
        <input
          type="text"
          value={newDesign.title}
          onChange={(e) =>
            setNewDesign({ ...newDesign, title: e.target.value })
          }
          placeholder="Design Title"
          className="p-2 border rounded"
        />
        <textarea
          value={newDesign.description}
          onChange={(e) =>
            setNewDesign({ ...newDesign, description: e.target.value })
          }
          placeholder="Description"
          className="p-2 border rounded"
        />
        <input
          type="number"
          value={newDesign.price}
          onChange={(e) =>
            setNewDesign({ ...newDesign, price: e.target.value })
          }
          placeholder="Price"
          className="p-2 border rounded"
        />
        <select
          multiple
          value={newDesign.tags}
          onChange={(e) =>
            setNewDesign({
              ...newDesign,
              tags: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            })
          }
          className="p-2 border rounded"
        >
          {predefinedServices.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newDesign.imageUrl}
          onChange={(e) =>
            setNewDesign({ ...newDesign, imageUrl: e.target.value })
          }
          placeholder="Image URL"
          className="p-2 border rounded"
        />
        <button
          onClick={handleAddDesign}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Design
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Tags</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {designs.map((design) => (
            <tr key={design._id} className="border-b">
              <td className="p-2">{design.title}</td>
              <td className="p-2">${design.price}</td>
              <td className="p-2">{design.tags.join(", ")}</td>
              <td className="p-2 flex space-x-2">
                <button className="text-blue-500">
                  <FaEdit />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(design._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesignManagement;
