import React, { useEffect } from "react";
import { FaFileAlt, FaUsers } from "react-icons/fa";
import { useCustomerStore } from "../../../store/Customer.store";
import { useOrderStore } from "../../../store/Order.store";

const RecentActivity = () => {
  const { orders, fetchOrders } = useOrderStore();
  const { customers, fetchCustomers } = useCustomerStore();

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, [fetchOrders, fetchCustomers]);

  const activities = [
    ...orders.slice(0, 2).map((order) => ({
      type: "order",
      description: `New order #${order._id} placed`,
      time: order.createdAt,
    })),
    ...customers.slice(0, 2).map((customer) => ({
      type: "customer",
      description: `New customer ${customer.name} registered`,
      time: customer.createdAt,
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div>
      <h2 className="text-lg font-bold mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start pb-4 border-b border-gray-100 last:border-0"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
              {activity.type === "order" ? (
                <FaFileAlt className="h-5 w-5" />
              ) : (
                <FaUsers className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="font-medium">{activity.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(activity.time).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-blue-500 text-sm font-medium">
        View all activity
      </button>
    </div>
  );
};

export default RecentActivity;
