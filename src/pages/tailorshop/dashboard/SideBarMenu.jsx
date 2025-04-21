import { motion } from "framer-motion";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  FaBox,
  FaCalendarAlt,
  FaCog,
  FaCut,
  FaFileAlt,
  FaHome,
  FaSignOutAlt,
  FaTag,
  FaUser,
  FaUsers,
  FaWrench,
} from "react-icons/fa";
import { useAuthStore } from "../../../store/Auth.store";
import { useShopStore } from "../../../store/Shop.store";

const SideBarMenu = ({ setActiveSection }) => {
  const { isExpanded, setIsExpanded } = useSidebar();
  const { user, logout } = useAuthStore();
  const { tailor, fetchTailorById } = useShopStore();
  const [isSidebarFullyExpanded, setIsSidebarFullyExpanded] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Fetch tailor data if not already available
    if (!tailor && user) {
      fetchTailorById(user.id);
    }
  }, [user, tailor, fetchTailorById]);

  // Removed unused toggleSidebar function

  const sidebarVariants = {
    expanded: {
      width: "240px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    },
    collapsed: {
      width: "60px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  };

  const handleAnimationComplete = (definition) => {
    if (definition === "expanded") {
      setIsSidebarFullyExpanded(true);
    } else if (definition === "collapsed") {
      setIsSidebarFullyExpanded(false);
    }
  };

  const menuItems = [
    {
      icon: <FaHome className="w-4 h-4" />,
      label: "Overview",
      section: "overview",
    },
    {
      icon: <FaFileAlt className="w-4 h-4" />,
      label: "Orders",
      section: "orders",
    },
    {
      icon: <FaBox className="w-4 h-4" />,
      label: "Inventory",
      section: "inventory",
    },
    {
      icon: <FaCut className="w-4 h-4" />,
      label: "Designs",
      section: "designs",
    },
    { icon: <FaTag className="w-4 h-4" />, label: "Offers", section: "offers" },
    {
      icon: <FaWrench className="w-4 h-4" />,
      label: "Services",
      section: "services",
    },
    {
      icon: <FaCalendarAlt className="w-4 h-4" />,
      label: "Availability",
      section: "availability",
    },
    {
      icon: <FaUsers className="w-4 h-4" />,
      label: "Customers",
      section: "customers",
    },
  ];

  return (
    <div className="flex">
      {/* Floating Sidebar */}
      <motion.div
        className="bg-white text-primary rounded-r-2xl h-auto max-h-screen py-6 px-2 fixed inset-y-0 left-0 z-40 transition-all duration-75 ease-in-out border-r border-gray-100 m-4 overflow-y-auto overflow-x-hidden"
        initial="expanded"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        transition={{ type: "spring", damping: 20, duration: 0.2 }}
        onAnimationComplete={handleAnimationComplete}
      >
        {/* Logo */}
        <div className="text-primary flex mb-6 justify-between items-center">
          <div className="flex items-center justify-center w-full">
            {isExpanded && isSidebarFullyExpanded ? (
              <motion.div
                className="flex items-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {tailor?.logoUrl && (
                  <img
                    src={tailor.logoUrl}
                    alt="Shop Logo"
                    className="h-8 w-auto rounded-full ml-2 mr-4"
                  />
                )}
                <span className="font-bold text-2xl">
                  {tailor?.shopName || "Welcome..."}
                </span>
              </motion.div>
            ) : (
              <motion.div
                className="w-full flex justify-center"
                whileHover={{ scale: 1.1 }}
              >
                {tailor?.logoUrl ? (
                  <img
                    src={tailor.logoUrl}
                    alt="Shop Logo"
                    className="h-8 w-auto rounded-full"
                  />
                ) : (
                  <span className="font-bold text-xs">TS</span>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveSection(item.section)}
              className="flex items-center w-full py-3 px-4 rounded-lg transition duration-200 hover:bg-blue-50 text-sm"
              whileHover={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                x: 3,
              }}
            >
              {item.icon}
              {isExpanded && (
                <motion.span
                  className="ml-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Bottom Section - Profile with nested options */}
        <div className="absolute bottom-6 left-0 w-full px-2">
          <motion.button
            onClick={() => isExpanded && setIsProfileOpen(!isProfileOpen)}
            className="flex items-center w-full py-3 px-4 rounded-lg transition duration-200 hover:bg-blue-50 text-sm"
            whileHover={{
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              x: 3,
            }}
          >
            <FaUser className="w-4 h-4" />
            {isExpanded && (
              <motion.span
                className="ml-4 flex-grow text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                Profile
              </motion.span>
            )}
          </motion.button>

          {/* Sub-items for Profile */}
          {isExpanded && isProfileOpen && (
            <motion.div
              className="ml-6 mt-2 space-y-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                onClick={() => setActiveSection("profile")}
                className="flex items-center py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-50 text-sm w-full"
                whileHover={{
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  x: 3,
                }}
              >
                <FaCog className="w-3 h-3" />
                <span className="ml-3">View Profile</span>
              </motion.button>
              <motion.button
                onClick={logout}
                className="flex items-center py-2 px-4 rounded-lg transition duration-200 hover:bg-red-50 text-sm text-red-500 w-full"
                whileHover={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  x: 3,
                }}
              >
                <FaSignOutAlt className="w-3 h-3" />
                <span className="ml-3">Logout</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Create a context for the sidebar
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleSidebarChange = (e) => {
      setIsExpanded(e.detail.expanded);
    };
    window.addEventListener("sidebarStateChange", handleSidebarChange);
    return () =>
      window.removeEventListener("sidebarStateChange", handleSidebarChange);
  }, []);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use the sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export default SideBarMenu;
