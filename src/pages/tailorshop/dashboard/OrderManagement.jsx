import { ChevronDown, Edit, Eye, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/Button";
import { useOrderStore } from "../../../store/Order.store";

const OrderManagement = () => {
  const { orders, fetchOrders, updateOrderStatus, updateOrder, deleteOrder } =
    useOrderStore();
  const [statusFilter, setStatusFilter] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderForm, setOrderForm] = useState({
    status: "",
    // Add other editable fields here
  });

  useEffect(() => {
    fetchOrders({ status: statusFilter });
  }, [fetchOrders, statusFilter]);

  // View order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (order) => {
    setSelectedOrder(order);
    setOrderForm({
      status: order.status,
      // Add other fields here
    });
    setEditModalOpen(true);
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit order updates
  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      await updateOrder(selectedOrder._id, orderForm);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (order) => {
    setSelectedOrder(order);
    setDeleteModalOpen(true);
  };

  // Confirm order deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteOrder(selectedOrder._id);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const badgeStyles = {
      pending: "bg-gray-100 text-gray-800",
      processing: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    const dotColors = {
      pending: "text-gray-800",
      processing: "text-yellow-800",
      completed: "text-green-800",
      cancelled: "text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${badgeStyles[status]}`}
      >
        <span className={`${dotColors[status]} text-sm`}>●</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
      <p className="text-xs text-gray-600">
        Stay updated on customer orders, from design requests to final delivery.
      </p>
      <div className="my-6 relative w-full md:w-1/4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <ChevronDown
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
          size={16}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th
                scope="col"
                className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
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
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-2 text-primary text-sm">{order._id}</td>
                  <td className="p-2 text-gray-800 text-sm">
                    {order?.customerId || "N/A"}
                  </td>
                  <td className="p-2">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(order)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(order)}
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
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Order Modal */}
      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
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
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Order ID
                  </h3>
                  <p className="text-gray-800">{selectedOrder._id}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Customer ID
                  </h3>
                  <p className="text-gray-800">
                    {selectedOrder.customerId || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Status
                  </h3>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Date Created
                  </h3>
                  <p className="text-gray-800">
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                {/* Add more order details here */}
              </div>

              {/* Order Items Section */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">
                    Order Items
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between pb-3 border-b border-gray-200 last:border-b-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.name || "Product"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.description || "No description"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-800">
                              {item.price ? `$${item.price.toFixed(2)}` : "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity || 1}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes/Comments Section */}
              {selectedOrder.notes && (
                <div className="mt-6">
                  <h3 className="text-sm text-red-600 mb-2">Notes:</h3>
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-2xl">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
            <div className="border-t px-6 py-4 flex justify-end">
              <CustomButton
                onClick={() => setViewModalOpen(false)}
                text="Cancel"
                color="primary"
                hover_color="hoverAccent"
                variant="outlined"
                width="w-1/3"
                height="h-9"
                type="submit"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Edit Order</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateOrder}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={selectedOrder._id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl bg-gray-50 text-primary/75"
                  />
                </div>
                <div className="relative w-full">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Status
                  </label>

                  <select
                    name="status"
                    value={orderForm.status}
                    onChange={handleFormChange}
                    className="p-2 pr-10 border border-gray-300 text-sm rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <ChevronDown
                    className="absolute right-3 top-[70%] transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={16}
                  />
                </div>
                {/* Add other editable fields here */}
              </div>
              <div className="border-t px-6 py-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete order{" "}
                <span className="font-semibold">{selectedOrder._id}</span>? This
                action cannot be undone.
              </p>
            </div>
            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
