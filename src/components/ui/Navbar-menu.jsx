"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FaChevronDown,
  FaRegHeart,
  FaRegUser,
  FaSearch,
  FaShoppingBag,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { predefinedServices } from "../../configs/Services.configs";
import { useAuthStore } from "../../store/Auth.store";
import { CustomButton } from "./Button";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const ProfileMenu = ({ mobile = false }) => {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const handleConfirmLogout = () => {
    setShowConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  if (mobile) {
    return (
      <div className="w-full">
        <a
          href={
            user?.role === 4 ? `/tailor/${user?._id}` : `/user/${user?._id}`
          }
          className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100"
        >
          <FaRegUser className="mr-3 text-primary" />
          <span>Account</span>
        </a>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        className="cursor-pointer flex items-center space-x-2 text-primary hover:text-hoverAccent"
        whileHover={{ scale: 1.1 }}
        onClick={() => setOpen(!open)}
      >
        <FaRegUser className="text-sm sm:text-base" />
      </motion.div>

      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
          className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md z-50"
        >
          {user?.role === 4 ? (
            <a
              href={`/tailor/${user?._id}`}
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              My Profile
            </a>
          ) : (
            <a
              href={`/user/${user?._id}`}
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              My Profile
            </a>
          )}
          <button
            onClick={handleConfirmLogout}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </motion.div>
      )}

      {showConfirm && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md z-50 p-4">
          <p className="text-sm mb-4">Are you sure you want to logout?</p>
          <div className="flex justify-between space-x-2">
            <CustomButton
              text="Yes"
              color="danger"
              hover_color="hoverAccent"
              variant="outlined"
              width="w-full"
              height="h-9"
              type="submit"
              onClick={handleLogout}
            />
            <CustomButton
              text="No"
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-full"
              height="h-9"
              type="submit"
              onClick={handleCancelLogout}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryMenu = ({ mobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (mobile) {
    return (
      <div className="w-full" ref={menuRef}>
        <button
          className="flex items-center justify-between w-full px-4 py-3 text-gray-800 hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <span>Categories</span>
          </div>
          <FaChevronDown
            className={`ml-2 text-xs transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="pl-4 bg-gray-50">
            {predefinedServices.map((service, index) => (
              <a
                key={index}
                href="/design"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                {service}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <motion.div
        className="cursor-pointer text-primary hover:text-hoverAccent flex items-center"
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm sm:text-base">Categories</span>
        <FaChevronDown className="ml-2 text-xs" />
      </motion.div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
          className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-md z-50 max-h-[70vh] overflow-y-auto"
        >
          <div className="py-1">
            {predefinedServices.map((service, index) => (
              <a
                key={index}
                href="/design"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                {service}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const NavbarMenu = () => {
  const [active, setActive] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const handleHeartClick = () => {
    if (isAuthenticated && user?._id) {
      // Ensure we have the correct path based on user role
      const connectionsUrl =
        user.role === 4
          ? `/tailor/${user._id}/connections`
          : `/user/${user._id}/connections`;
      navigate(connectionsUrl);
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  };

  return (
    <>
      {searchOpen && (
        <div className="fixed top-0 left-0 right-0 bg-white p-3 z-50 shadow-md sm:hidden flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-secondary rounded-full focus:border-primary focus:outline-none"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setSearchOpen(false)}
            className="ml-2 text-gray-500"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <nav
        onMouseLeave={() => setActive(null)}
        className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-input rounded-full border border-transparent flex justify-between items-center px-4 py-3 sm:px-8 sm:py-4 w-full max-w-screen-xl mx-auto shadow-lg shadow-gray-100 ${
          searchOpen ? "hidden sm:flex" : ""
        }`}
      >
        <button
          className="sm:hidden mr-2 text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <motion.img
          src="/logo-black-full.png"
          alt="Logo"
          className="h-6 sm:h-6 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={() => (window.location.href = "/")}
        />

        <div className="hidden sm:flex items-center space-x-6 ml-6">
          <CategoryMenu />
        </div>

        <div className="hidden sm:block flex-grow mx-6">
          <div className="relative max-w-md mx-auto">
            <motion.input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-secondary rounded-full focus:border-primary hover:border-primary focus:outline-none"
              whileHover={{ scale: 1.02 }}
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-4">
          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <motion.a
              href="/login"
              className="text-primary hover:text-hoverAccent text-sm"
              whileHover={{ scale: 1.1 }}
            >
              Login
            </motion.a>
          )}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer"
            onClick={handleHeartClick}
          >
            <FaRegHeart className="text-primary hover:text-hoverAccent" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
            <FaShoppingBag className="text-primary hover:text-hoverAccent" />
          </motion.div>
          <div className="border-l border-secondary h-6 mx-2"></div>
          <motion.img
            src="/logo-black-short.png"
            alt="Logo"
            className="h-6 cursor-pointer"
            whileHover={{ scale: 1.3 }}
            onClick={() => (window.location.href = "/design")}
          />
        </div>

        <div className="flex sm:hidden items-center space-x-4 ml-auto">
          <button onClick={() => setSearchOpen(true)} className="text-primary">
            <FaSearch />
          </button>
          <button onClick={handleHeartClick} className="text-primary">
            <FaRegHeart />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden">
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full w-3/4 max-w-xs bg-white shadow-lg flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto">
                <CategoryMenu mobile={true} />

                <div className="border-t border-gray-200 my-1"></div>

                {isAuthenticated && <ProfileMenu mobile={true} />}

                <a
                  onClick={handleHeartClick}
                  className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100 cursor-pointer"
                >
                  <FaRegHeart className="mr-3 text-primary" />
                  <span>Connections</span>
                </a>

                <a
                  href="#"
                  className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100"
                >
                  <FaShoppingBag className="mr-3 text-primary" />
                  <span>Orders</span>
                </a>

                <div className="border-t border-gray-200 my-1"></div>

                <a
                  href="/design"
                  className="flex items-center justify-center px-4 py-3 text-gray-800 hover:bg-gray-100"
                >
                  <img
                    src="/logo-black-short.png"
                    alt="Design"
                    className="h-12 cursor-pointer"
                  />
                </a>
              </div>

              {isAuthenticated && (
                <div className="mt-auto p-4 border-t">
                  <CustomButton
                    text="Logout"
                    color="danger"
                    hover_color="hoverAccent"
                    variant="outlined"
                    width="w-full"
                    height="h-9"
                    type="submit"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </nav>

      <div className="h-16 sm:h-20"></div>
    </>
  );
};

export default NavbarMenu;
