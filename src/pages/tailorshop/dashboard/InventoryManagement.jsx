import { ChevronDown, Edit, Eye, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";
import { sizeOptions, units } from "../../../configs/Inventory.config";
import { useInventoryStore } from "../../../store/Inventory.store";

const InventoryManagement = () => {
  const {
    inventory,
    fetchInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    isLoading,
  } = useInventoryStore();
  const [typeFilter, setTypeFilter] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState({
    inStock: false,
    lowStock: false,
  });
  const [sizeFilter, setSizeFilter] = useState("");
  const [quantityRange, setQuantityRange] = useState({ min: "", max: "" });
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: "",
    type: "",
    quantity: "",
    size: "",
    unit: "",
    lowStockThreshold: "",
    costPerUnit: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    type: "",
    quantity: "",
    size: "",
    unit: "",
    lowStockThreshold: "",
    costPerUnit: "",
  });
  // Store unique types for filtering
  const [availableTypes, setAvailableTypes] = useState([]);
  // Defined units and sizes

  useEffect(() => {
    const filters = {
      type: typeFilter,
      isLowStock:
        stockStatusFilter.inStock && stockStatusFilter.lowStock
          ? undefined
          : stockStatusFilter.lowStock
          ? true
          : stockStatusFilter.inStock
          ? false
          : undefined,
      size: sizeFilter || undefined,
      minQuantity: quantityRange.min ? parseInt(quantityRange.min) : undefined,
      maxQuantity: quantityRange.max ? parseInt(quantityRange.max) : undefined,
    };
    fetchInventory(filters);
  }, [
    fetchInventory,
    typeFilter,
    stockStatusFilter,
    sizeFilter,
    quantityRange,
  ]);

  // Extract unique types from inventory for the filter dropdown
  useEffect(() => {
    if (inventory.length > 0) {
      const types = [...new Set(inventory.map((item) => item.type))];
      setAvailableTypes(types);
    }
  }, [inventory]);

  // Handle stock status checkbox changes
  const handleStockStatusChange = (e) => {
    const { name, checked } = e.target;
    setStockStatusFilter((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle quantity range input changes
  const handleQuantityRangeChange = (e) => {
    const { name, value } = e.target;
    setQuantityRange((prev) => ({ ...prev, [name]: value }));
  };

  // View item details
  const handleViewItem = (item) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setItemForm({
      name: item.name,
      type: item.type,
      quantity: item.quantity.toString(),
      size: item.size || "",
      unit: item.unit,
      lowStockThreshold: item.lowStockThreshold.toString(),
      costPerUnit: item.costPerUnit.toString(),
    });
    setEditModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setItemForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new item form changes
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  // Add new inventory item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!newItem.name) {
      setError("Name is required");
      return;
    }
    if (!newItem.type) {
      setError("Type is required");
      return;
    }
    if (isNaN(newItem.quantity) || newItem.quantity < 0) {
      setError("Quantity must be a non-negative number");
      return;
    }
    if (!newItem.unit) {
      setError("Unit is required");
      return;
    }
    if (isNaN(newItem.lowStockThreshold) || newItem.lowStockThreshold < 0) {
      setError("Low stock threshold must be a non-negative number");
      return;
    }
    if (isNaN(newItem.costPerUnit) || newItem.costPerUnit < 0) {
      setError("Cost per unit must be a non-negative number");
      return;
    }

    try {
      const itemData = {
        name: newItem.name,
        type: newItem.type,
        quantity: parseInt(newItem.quantity),
        size: newItem.size || undefined,
        unit: newItem.unit,
        lowStockThreshold: parseInt(newItem.lowStockThreshold),
        costPerUnit: parseFloat(newItem.costPerUnit),
      };
      await createInventoryItem(itemData);
      setNewItem({
        name: "",
        type: "",
        quantity: "",
        size: "",
        unit: "",
        lowStockThreshold: "",
        costPerUnit: "",
      });
      setSuccess("Item added successfully");
      setTimeout(() => setSuccess(null), 1500);
    } catch (error) {
      setError(error.message || "Error adding item");
    }
  };

  // Update inventory item
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!itemForm.name) {
      setError("Name is required");
      return;
    }
    if (!itemForm.type) {
      setError("Type is required");
      return;
    }
    if (isNaN(itemForm.quantity) || itemForm.quantity < 0) {
      setError("Quantity must be a non-negative number");
      return;
    }
    if (!itemForm.unit) {
      setError("Unit is required");
      return;
    }
    if (isNaN(itemForm.lowStockThreshold) || itemForm.lowStockThreshold < 0) {
      setError("Low stock threshold must be a non-negative number");
      return;
    }
    if (isNaN(itemForm.costPerUnit) || itemForm.costPerUnit < 0) {
      setError("Cost per unit must be a non-negative number");
      return;
    }

    try {
      const updatedData = {
        name: itemForm.name,
        type: itemForm.type,
        quantity: parseInt(itemForm.quantity),
        size: itemForm.size || undefined,
        unit: itemForm.unit,
        lowStockThreshold: parseInt(itemForm.lowStockThreshold),
        costPerUnit: parseFloat(itemForm.costPerUnit),
      };
      await updateInventoryItem(selectedItem._id, updatedData);
      setSuccess("Item updated successfully");
      setTimeout(() => {
        setEditModalOpen(false);
        setSuccess(null);
      }, 1500);
    } catch (error) {
      setError(error.message || "Error updating item");
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  // Confirm item deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteInventoryItem(selectedItem._id);
      setDeleteModalOpen(false);
    } catch (error) {
      setError(error.message || "Error deleting item");
    }
  };

  // Stock status badge
  const StockBadge = ({ isLowStock }) => {
    return (
      <span
        className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
          isLowStock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }`}
      >
        <span
          className={`${
            isLowStock ? "text-red-800" : "text-green-800"
          } text-sm`}
        >
          ●
        </span>
        {isLowStock ? "Low Stock" : "In Stock"}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-bold text-gray-800">Inventory Management</h1>
      <p className="text-xs text-gray-600">
        Manage your inventory of fabrics, buttons, and other materials.
      </p>

      {/* Add New Item Form */}
      <div className="my-6">
        <h2 className="text-sm font-medium text-primary mb-4">Add New Item</h2>
        <form
          onSubmit={handleAddItem}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {error && (
            <p className="text-red-600 text-sm col-span-full">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm col-span-full">{success}</p>
          )}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleNewItemChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., Coconut Buttons"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Type
            </label>
            <input
              type="text"
              name="type"
              value={newItem.type}
              onChange={handleNewItemChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., Buttons, Fabric, Thread"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleNewItemChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              min="0"
            />
          </div>
          <div className="relative">
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Size (Optional)
            </label>
            <select
              name="size"
              value={newItem.size}
              onChange={handleNewItemChange}
              className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            >
              <option value="">Select Size</option>
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-[65%] transform -translate-y-1/2 text-gray-500 pointer-events-none"
              size={16}
            />
          </div>
          <div className="relative">
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Unit
            </label>
            <select
              name="unit"
              value={newItem.unit}
              onChange={handleNewItemChange}
              className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
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
              Low Stock Threshold
            </label>
            <input
              type="number"
              name="lowStockThreshold"
              value={newItem.lowStockThreshold}
              onChange={handleNewItemChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              min="0"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Cost per Unit
            </label>
            <input
              type="number"
              name="costPerUnit"
              value={newItem.costPerUnit}
              onChange={handleNewItemChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex items-end">
            <CustomButton
              type="submit"
              text={isLoading ? "Adding..." : "Add Item"}
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-full"
              height="h-9"
            />
          </div>
        </form>
      </div>

      {/* Filters */}

      <h2 className="text-sm font-medium text-primary mb-[-4px] mt-4">
        Filter Items
      </h2>
      <div className="my-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <h2 className="text-xs font-medium text-gray-500 mb-1 block">
            Filter by Quantity Range
          </h2>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            >
              <option value="">All Types</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-[50%] transform -translate-y-1/2 text-gray-500 pointer-events-none"
              size={16}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xs font-medium text-gray-500 mb-1 block">
            Stock Status
          </h2>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="inStock"
                checked={stockStatusFilter.inStock}
                onChange={handleStockStatusChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="lowStock"
                checked={stockStatusFilter.lowStock}
                onChange={handleStockStatusChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded accent-primary"
              />
              <span className="text-sm text-gray-700">Low Stock</span>
            </label>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-medium text-gray-500 mb-1 block">
            Filter by Size
          </h2>
          <div className="relative">
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            >
              <option value="">All Sizes</option>
              <option value="no-size">No Size</option>
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-[50%] transform -translate-y-1/2 text-gray-500 pointer-events-none"
              size={16}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xs font-medium text-gray-500 mb-1 block">
            Filter by Quantity Range
          </h2>
          <div className="flex space-x-2">
            <input
              type="number"
              name="min"
              value={quantityRange.min}
              onChange={handleQuantityRangeChange}
              placeholder="Min"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              min="0"
            />
            <input
              type="number"
              name="max"
              value={quantityRange.max}
              onChange={handleQuantityRangeChange}
              placeholder="Max"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto mt-12">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Stock Status
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-2 text-primary text-sm">{item.name}</td>
                  <td className="p-2 text-gray-800 text-sm">{item.type}</td>
                  <td className="p-2 text-gray-800 text-sm">{item.quantity}</td>
                  <td className="p-2 text-gray-800 text-sm">
                    {item.size || "N/A"}
                  </td>
                  <td className="p-2 text-gray-800 text-sm">{item.unit}</td>
                  <td className="p-2">
                    <StockBadge isLowStock={item.isLowStock} />
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleViewItem(item)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(item)}
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
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  {isLoading ? <Loader /> : "No inventory items found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Item Modal */}
      {viewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Item Details</h2>
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
                  <p className="text-gray-800">{selectedItem._id}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Name
                  </h3>
                  <p className="text-gray-800">{selectedItem.name}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Type
                  </h3>
                  <p className="text-gray-800">{selectedItem.type}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Quantity
                  </h3>
                  <p className="text-gray-800">{selectedItem.quantity}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Size
                  </h3>
                  <p className="text-gray-800">{selectedItem.size || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Unit
                  </h3>
                  <p className="text-gray-800">{selectedItem.unit}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Low Stock Threshold
                  </h3>
                  <p className="text-gray-800">
                    {selectedItem.lowStockThreshold}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Cost per Unit
                  </h3>
                  <p className="text-gray-800">
                    LKR {selectedItem.costPerUnit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Stock Status
                  </h3>
                  <StockBadge isLowStock={selectedItem.isLowStock} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Created At
                  </h3>
                  <p className="text-gray-800">
                    {new Date(selectedItem.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Updated At
                  </h3>
                  <p className="text-gray-800">
                    {new Date(selectedItem.updatedAt).toLocaleString()}
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

      {/* Edit Item Modal */}
      {editModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Edit Item</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateItem}>
              <div className="p-6 space-y-4">
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Item ID
                  </label>
                  <input
                    type="text"
                    value={selectedItem._id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl bg-gray-50 text-primary/75"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={itemForm.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., Coconut Buttons"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={itemForm.type}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., Buttons, Fabric, Thread"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={itemForm.quantity}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    min="0"
                  />
                </div>
                <div className="relative w-full">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Size (Optional)
                  </label>
                  <select
                    name="size"
                    value={itemForm.size}
                    onChange={handleFormChange}
                    className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                  >
                    <option value="">Select Size</option>
                    {sizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-[65%] transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={16}
                  />
                </div>
                <div className="relative w-full">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={itemForm.unit}
                    onChange={handleFormChange}
                    className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                  >
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-[65%] transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={16}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={itemForm.lowStockThreshold}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Cost per Unit
                  </label>
                  <input
                    type="number"
                    name="costPerUnit"
                    value={itemForm.costPerUnit}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    min="0"
                    step="0.01"
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
      {deleteModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete item{" "}
                <span className="font-semibold text-primary">
                  {selectedItem.name}
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

export default InventoryManagement;
