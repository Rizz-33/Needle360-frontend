import { ChevronDown, Edit, Eye, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CustomButton } from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";
import { useAuthStore } from "../../../store/Auth.store";
import { useOrderStore } from "../../../store/Order.store";

const OrderManagement = () => {
  const {
    orders,
    fetchOrders,
    updateOrder,
    deleteOrder,
    approveOrRejectOrder,
    initializeSocket,
    disconnectSocket,
    isLoading,
    error: storeError,
  } = useOrderStore();
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderForm, setOrderForm] = useState({
    status: "",
    totalAmount: "",
    orderType: "",
    dueDate: "",
    customerContact: "",
    notes: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (user?._id && user?.role) {
      initializeSocket(user._id, user.role);
    }
    return () => {
      disconnectSocket();
    };
  }, [user?._id, user?.role, initializeSocket, disconnectSocket]);

  // Fetch orders based on status filter
  useEffect(() => {
    fetchOrders({ status: statusFilter, page: 1, limit: 10 });
  }, [fetchOrders, statusFilter]);

  // Display store errors if any
  useEffect(() => {
    if (storeError) {
      toast.error(storeError);
    }
  }, [storeError]);

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
      totalAmount: order.totalAmount.toString(),
      orderType: order.orderType,
      dueDate: new Date(order.dueDate).toISOString().split("T")[0],
      customerContact: order.customerContact || "",
      notes: order.notes || "",
    });
    setEditModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit order updates
  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!orderForm.status) {
      setError("Status is required");
      return;
    }
    if (isNaN(orderForm.totalAmount) || orderForm.totalAmount < 0) {
      setError("Total amount must be a non-negative number");
      return;
    }
    if (!orderForm.orderType) {
      setError("Order type is required");
      return;
    }
    if (!orderForm.dueDate) {
      setError("Due date is required");
      return;
    }

    try {
      const updatedData = {
        status: orderForm.status,
        totalAmount: parseFloat(orderForm.totalAmount),
        orderType: orderForm.orderType,
        dueDate: new Date(orderForm.dueDate).toISOString(),
        customerContact: orderForm.customerContact,
        notes: orderForm.notes,
      };

      await updateOrder(selectedOrder._id, updatedData);
      setSuccess("Order updated successfully");
      toast.success("Order updated successfully!");
      setTimeout(() => {
        setEditModalOpen(false);
        setSuccess(null);
      }, 1500);
    } catch (error) {
      setError(error.message || "Error updating order");
      toast.error(error.message || "Error updating order");
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
      toast.success("Order deleted successfully!");
      setDeleteModalOpen(false);
    } catch (error) {
      setError(error.message || "Error deleting order");
      toast.error(error.message || "Error deleting order");
    }
  };

  // Approve or reject order
  const handleApproveOrReject = async (orderId, action) => {
    try {
      await approveOrRejectOrder(orderId, action);
      toast.success(
        `Order ${action === "approve" ? "approved" : "rejected"} successfully!`
      );
    } catch (error) {
      toast.error(`Failed to ${action} order`);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const badgeStyles = {
      requested: "bg-purple-100 text-purple-800",
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    const dotColors = {
      requested: "text-purple-800",
      pending: "text-yellow-800",
      processing: "text-blue-800",
      completed: "text-green-800",
      cancelled: "text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
          badgeStyles[status] || "bg-gray-100 text-gray-800"
        }`}
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
          <option value="requested">Requested</option>
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
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Customer Contact
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Order Type
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
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-2 text-primary text-sm">{order._id}</td>
                  <td className="p-2 text-gray-800 text-sm">
                    {order.customerContact || "N/A"}
                  </td>
                  <td className="p-2 text-gray-800 text-sm">
                    {order.orderType}
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
                    {user.role === 4 && order.status === "requested" ? (
                      <>
                        <button
                          onClick={() =>
                            handleApproveOrReject(order._id, "approve")
                          }
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded-full transition-colors"
                          title="Approve"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            handleApproveOrReject(order._id, "reject")
                          }
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded-full transition-colors"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      user.role === 4 && (
                        <button
                          onClick={() => handleOpenEditModal(order)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                      )
                    )}
                    {user.role === 4 && (
                      <button
                        onClick={() => handleOpenDeleteModal(order)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  {isLoading ? <Loader /> : "No orders found"}
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
                    Customer Contact
                  </h3>
                  <p className="text-gray-800">
                    {selectedOrder.customerContact || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Order Type
                  </h3>
                  <p className="text-gray-800">{selectedOrder.orderType}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Status
                  </h3>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Due Date
                  </h3>
                  <p className="text-gray-800">
                    {new Date(selectedOrder.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Total Amount
                  </h3>
                  <p className="text-gray-800">
                    LKR {selectedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Date Created
                  </h3>
                  <p className="text-gray-800">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Measurements Section */}
              {selectedOrder.measurements &&
                Object.keys(selectedOrder.measurements).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xs text-gray-500 mb-2">Measurements</h3>
                    <div className="bg-blue-50 rounded-2xl p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedOrder.measurements).map(
                          ([key, value]) => (
                            <div key={key}>
                              <p className="text-sm text-gray-500">{key}</p>
                              <p className="font-medium text-gray-800">
                                {value}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* Notes Section */}
              {selectedOrder.notes && (
                <div className="mt-6">
                  <h3 className="text-xs text-gray-500 mb-2">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-2xl">
                    {selectedOrder.notes}
                  </p>
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

      {/* Edit Order Modal */}
      {editModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
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
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Order Type
                  </label>
                  <input
                    type="text"
                    name="orderType"
                    value={orderForm.orderType}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl bg-gray-50 text-primary/75"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={orderForm.dueDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl bg-gray-50 text-primary/75"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Total Amount (LKR)
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={orderForm.totalAmount}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Customer Contact
                  </label>
                  <input
                    type="text"
                    name="customerContact"
                    value={orderForm.customerContact}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl bg-gray-50 text-primary/75"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={orderForm.notes}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    rows="4"
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
                  disabled={isLoading}
                />
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
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete order{" "}
                <span className="font-semibold text-primary">
                  {selectedOrder._id}
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

export default OrderManagement;
