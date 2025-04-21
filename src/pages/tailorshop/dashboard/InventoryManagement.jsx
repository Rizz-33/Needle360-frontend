import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fabricTypes, sizeOptions } from "../../../configs/Design.configs";
import { useInventoryStore } from "../../../store/Inventory.store";

const InventoryManagement = () => {
  const {
    inventory,
    fetchInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  } = useInventoryStore();
  const [newItem, setNewItem] = useState({ type: "", quantity: 0, size: "" });

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAddItem = async () => {
    try {
      await createInventoryItem(newItem);
      setNewItem({ type: "", quantity: 0, size: "" });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInventoryItem(id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-6">Inventory Management</h2>
      <div className="mb-4 flex space-x-4">
        <select
          value={newItem.type}
          onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select Fabric</option>
          {fabricTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          placeholder="Quantity"
          className="p-2 border rounded"
        />
        <select
          value={newItem.size}
          onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select Size</option>
          {sizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Item
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Quantity</th>
            <th className="p-2 text-left">Size</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item._id} className="border-b">
              <td className="p-2">{item.type}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">{item.size}</td>
              <td className="p-2 flex space-x-2">
                <button className="text-blue-500">
                  <FaEdit />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(item._id)}
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

export default InventoryManagement;
