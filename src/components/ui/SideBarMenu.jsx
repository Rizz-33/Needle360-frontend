import { motion } from "framer-motion";
import { createContext, useContext, useEffect, useState } from "react";
import {
  FaCog,
  FaHome,
  FaList,
  FaSignOutAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";

const SideBarMenu = () => {
  const { isExpanded, setIsExpanded } = useSidebar();
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarFullyExpanded, setIsSidebarFullyExpanded] = useState(true);

  // Emit an event when the sidebar state changes
  useEffect(() => {
    // Create a custom event to notify parent components about sidebar state
    const event = new CustomEvent("sidebarStateChange", {
      detail: { expanded: isExpanded },
    });
    window.dispatchEvent(event);
  }, [isExpanded]);

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

  return (
    <div className="flex">
      {/* Floating Sidebar */}
      <motion.div
        className="bg-white text-primary rounded-r-2xl h-auto max-h-screen py-6 px-2 fixed inset-y-0 left-0 z-40 transition-all duration-75 ease-in-out border-r border-gray-100 m-4 overflow-y-auto overflow-x-hidden" // Added overflow-x-hidden
        initial="expanded"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        transition={{ type: "spring", damping: 20, duration: 0.2 }}
        onAnimationComplete={handleAnimationComplete}
      >
        {/* Logo */}
        <div className="text-primary flex mb-6">
          {isExpanded && isSidebarFullyExpanded ? (
            <motion.img
              src="/logo-black-full.png"
              alt="Logo"
              className="h-6 mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <motion.img
              src="/logo-black-short.png"
              alt="Logo"
              className="h-6 mx-auto"
              whileHover={{ scale: 1.1 }}
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1">
          {/* Dashboard */}
          <motion.a
            href="/dashboard"
            className="flex items-center py-3 px-4 rounded-lg transition duration-200 hover:bg-blue-50 text-sm"
            whileHover={{
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              x: 3,
            }}
          >
            <FaHome className="w-4 h-4" />
            {isExpanded && (
              <motion.span
                className="ml-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                Dashboard
              </motion.span>
            )}
          </motion.a>

          {/* New Requests */}
          <motion.a
            href="/pending-tailors"
            className="flex items-center py-3 px-4 rounded-lg transition duration-200 hover:bg-blue-50 text-sm"
            whileHover={{
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              x: 3,
            }}
          >
            <FaList className="w-4 h-4" />
            {isExpanded && (
              <motion.span
                className="ml-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                New Requests
              </motion.span>
            )}
          </motion.a>

          {/* User Management */}
          <div>
            <motion.button
              onClick={() =>
                isExpanded && setIsUserManagementOpen(!isUserManagementOpen)
              }
              className="flex items-center w-full py-3 px-4 rounded-lg transition duration-200 hover:bg-blue-50 text-sm"
              whileHover={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                x: 3,
              }}
            >
              <FaUsers className="w-4 h-4" />
              {isExpanded && (
                <motion.span
                  className="ml-4 flex-grow text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  User Management
                </motion.span>
              )}
            </motion.button>

            {/* Sub-items for User Management */}
            {isExpanded && isUserManagementOpen && (
              <motion.div
                className="ml-6 mt-2 space-y-2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.a
                  href="#"
                  className="flex items-center py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-50 text-sm"
                  whileHover={{
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    x: 3,
                  }}
                >
                  <FaUsers className="w-3 h-3" />
                  <span className="ml-3">Tailor Management</span>
                </motion.a>
                <motion.a
                  href="#"
                  className="flex items-center py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-50 text-sm"
                  whileHover={{
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    x: 3,
                  }}
                >
                  <FaUsers className="w-3 h-3" />
                  <span className="ml-3">Customer Management</span>
                </motion.a>
              </motion.div>
            )}
          </div>
        </nav>

        {/* Bottom Section - Profile */}
        <div className="absolute bottom-6 left-0 w-full px-2">
          <div>
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
                <motion.a
                  href="#"
                  className="flex items-center py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-50 text-sm"
                  whileHover={{
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    x: 3,
                  }}
                >
                  <FaCog className="w-3 h-3" />
                  <span className="ml-3">Settings</span>
                </motion.a>
                <motion.a
                  href="#"
                  className="flex items-center py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-50 text-sm"
                  whileHover={{
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    x: 3,
                  }}
                >
                  <FaSignOutAlt className="w-3 h-3" />
                  <span className="ml-3">Logout</span>
                </motion.a>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SideBarMenu;

// Create a context for sidebar state
const SidebarContext = createContext();

// Provider component
export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use the sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
