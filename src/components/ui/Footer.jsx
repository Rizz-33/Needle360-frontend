import { motion } from "framer-motion";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-black to-hoverAccent text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Logo and Description */}
          <div className="md:text-left">
            <motion.img
              src="/logo-white-full.png"
              alt="Logo"
              className="h-6 sm:h-8 pl-0 sm:pl-0 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              onClick={() => (window.location.href = "/")}
            />
            <p className="text-gray-200 pt-4 text-xs md:text-xs">
              Your one-stop platform for customizable clothing and designs.
              Discover, create, and order unique apparel tailored just for you.
            </p>
          </div>

          {/* Links */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="text-gray-200 text-sm space-y-2">
              <li>
                <a href="#home" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="https://facebook.com"
                className="text-gray-200 hover:text-white"
              >
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-200 hover:text-white"
              >
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-200 hover:text-white"
              >
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-200 hover:text-white"
              >
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-hoverAccent py-1">
        <p className="text-center text-gray-400 text-xs">
          needle360. All rights reserved.
        </p>
        <p className="text-center text-gray-400 text-[10px]">
          <a href="https://github.com/Rizz-33" className="hover:text-white">
            @Rizz-33
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
