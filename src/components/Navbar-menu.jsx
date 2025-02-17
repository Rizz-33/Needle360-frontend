"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  FaChevronDown,
  FaRegHeart,
  FaRegUser,
  FaSearch,
  FaShoppingBag,
} from "react-icons/fa";
import { useAuthStore } from "../store/Auth.store";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const ProfileMenu = () => {
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

  return (
    <div className="relative">
      <motion.div
        className="cursor-pointer flex items-center space-x-2 text-primary hover:text-hoverAccent"
        whileHover={{ scale: 1.1 }}
        onClick={() => setOpen(!open)}
      >
        <FaRegUser className="text-xs sm:text-base" />
      </motion.div>

      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
          className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-50"
        >
          <a
            href="/account"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Account
          </a>
          <button
            onClick={handleConfirmLogout}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </motion.div>
      )}

      {showConfirm && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-50 p-4">
          <p className="text-sm mb-4">Are you sure you want to logout?</p>
          <div className="flex justify-between">
            <button
              onClick={handleLogout}
              className="px-2 py-1 text-sm bg-red-500 text-white rounded"
            >
              Yes
            </button>
            <button
              onClick={handleCancelLogout}
              className="px-2 py-1 text-sm bg-gray-300 rounded"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const NavbarMenu = () => {
  const [active, setActive] = useState(null);
  const { isAuthenticated } = useAuthStore(); // Get auth state

  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="fixed top-0 left-0 right-0 z-50 overflow-visible rounded-full border border-transparent dark:border-primary/[0.2] bg-white shadow-input flex justify-between items-center px-2 py-1 sm:px-8 sm:py-4 text-xs sm:text-sm w-full max-w-screen-xl mx-auto shadow-lg shadow-gray-100"
    >
      <div className="flex items-center space-x-2 sm:space-x-10">
        <motion.img
          src="/logo-black-full.png"
          alt="Logo"
          className="h-4 sm:h-6 pl-1 sm:pl-5 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={() => (window.location.href = "/")}
        />
        <motion.div className="relative pl-5" whileHover={{ scale: 1.1 }}>
          <span className="cursor-pointer text-primary hover:text-hoverAccent flex items-center">
            Categories <FaChevronDown className="ml-2 text-[10px]" />
          </span>
        </motion.div>
      </div>
      <div className="flex-grow mx-1 sm:mx-6">
        <motion.input
          type="text"
          placeholder="Search..."
          className="hidden sm:block w-full px-1 py-1 sm:px-4 sm:py-2 border border-secondary rounded-full focus:border-primary hover:border-primary focus:outline-none"
          whileHover={{ scale: 1.02 }}
        />
        <motion.div className="block sm:hidden">
          <FaSearch className="text-primary cursor-pointer hover:text-hoverAccent mx-2" />
        </motion.div>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-4 pr-1 sm:pr-7">
        {isAuthenticated ? (
          <ProfileMenu />
        ) : (
          <motion.a
            href="/login"
            className="text-primary hover:text-hoverAccent px-1 sm:px-5 text-xs sm:text-sm"
            whileHover={{ scale: 1.1 }}
          >
            Login
          </motion.a>
        )}
        <motion.div whileHover={{ scale: 1.1 }} className="mx-2">
          <FaRegHeart className="text-primary cursor-pointer hover:text-hoverAccent text-xs sm:text-base" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="mx-2">
          <FaShoppingBag className="text-primary cursor-pointer hover:text-hoverAccent text-xs sm:text-base" />
        </motion.div>
      </div>
      <div className="border-l border-secondary h-4 sm:h-6 mx-1 sm:mx-2">
        <motion.img
          src="/logo-black-short.png"
          alt="Logo"
          className="h-4 sm:h-6 pl-1 sm:pl-5 cursor-pointer"
          whileHover={{ scale: 1.3 }}
          onClick={() => (window.location.href = "/designs")}
        />
      </div>
    </nav>
  );
};

export default NavbarMenu;
