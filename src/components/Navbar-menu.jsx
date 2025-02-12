"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaChevronDown, FaRegHeart, FaShoppingBag } from "react-icons/fa";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const MenuItem = ({ setActive, active, item, children }) => (
  <div onMouseEnter={() => setActive(item)} className="relative">
    <motion.p
      transition={{ duration: 0.3 }}
      className="cursor-pointer text-primary hover:text-hoverAccent px-4" // Increased padding
    >
      {item}
    </motion.p>
    {active === item && (
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={transition}
        className="absolute left-1/2 top-full transform -translate-x-1/2 pt-1 z-50"
      >
        <motion.div
          transition={transition}
          layoutId="active"
          className="bg-white backdrop-blur-sm rounded-full overflow-hidden border border-primary/[0.2] dark:border-primary/[0.2] shadow-l"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        >
          <motion.div layout className="w-max h-full p-2">
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    )}
  </div>
);

const Menu = ({ setActive, active, children }) => (
  <nav
    onMouseLeave={() => setActive(null)}
    className="relative z-50 overflow-visible rounded-full border border-transparent dark:border-primary/[0.2] bg-white shadow-input flex justify-between items-center px-8 py-4 text-sm w-full max-w-screen-xl mx-auto"
  >
    {children}
  </nav>
);

const HoveredLink = ({ children, href }) => (
  <a href={href} className="text-primary hover:text-hoverAccent px-2 text-xs">
    {children}
  </a>
);

const NavbarMenu = () => {
  const [active, setActive] = useState(null);
  return (
    <Menu setActive={setActive} active={active}>
      <div className="flex items-center space-x-10">
        <motion.img
          src="/logo-black-full.png"
          alt="Logo"
          className="h-8 pl-5"
          whileHover={{ scale: 1.1 }}
        />
        <motion.div className="relative pl-8" whileHover={{ scale: 1.1 }}>
          <span className="cursor-pointer text-primary hover:text-hoverAccent flex items-center">
            Categories <FaChevronDown className="ml-2 text-[10px]" />
          </span>
          {/* Dropdown content can be added here */}
        </motion.div>
      </div>
      <div className="flex-grow mx-6">
        <motion.input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border border-secondary rounded-full focus:border-primary hover:border-primary focus:outline-none"
          whileHover={{ scale: 1.02 }}
        />
      </div>
      <div className="flex items-center space-x-4 pr-7">
        <motion.a
          href="/login"
          className="text-primary hover:text-hoverAccent px-5"
          whileHover={{ scale: 1.1 }}
        >
          Login
        </motion.a>
        <motion.div whileHover={{ scale: 1.1 }}>
          <FaRegHeart className="text-primary cursor-pointer hover:text-hoverAccent" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }}>
          <FaShoppingBag className="text-primary cursor-pointer hover:text-hoverAccent text-base" />
        </motion.div>
        <div className="border-l border-secondary h-6 mx-2"></div>
        <motion.img
          src="/logo-black-short.png"
          alt="Logo"
          className="h-6 pl-5"
          whileHover={{ scale: 1.3 }}
        />
      </div>
    </Menu>
  );
};

export { NavbarMenu as default, HoveredLink, Menu, MenuItem };
