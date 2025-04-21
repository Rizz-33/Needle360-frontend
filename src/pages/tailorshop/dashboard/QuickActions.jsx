import React from "react";
import {
  FaBox,
  FaCalendarAlt,
  FaCut,
  FaFileAlt,
  FaTag,
  FaUsers,
  FaWrench,
} from "react-icons/fa";

const QuickActions = ({ setActiveSection }) => {
  const actions = [
    { title: "Manage Orders", icon: <FaFileAlt />, section: "orders" },
    { title: "Manage Inventory", icon: <FaBox />, section: "inventory" },
    { title: "Manage Designs", icon: <FaCut />, section: "designs" },
    { title: "Manage Offers", icon: <FaTag />, section: "offers" },
    { title: "Manage Services", icon: <FaWrench />, section: "services" },
    {
      title: "Manage Availability",
      icon: <FaCalendarAlt />,
      section: "availability",
    },
    { title: "Manage Customers", icon: <FaUsers />, section: "customers" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex items-center p-3 rounded-lg hover:bg-blue-50 text-left transition-colors"
            onClick={() => setActiveSection(action.section)}
          >
            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
              {action.icon}
            </div>
            <span className="font-medium">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
