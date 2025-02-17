import React from "react";

const Footer = () => {
  return (
    <footer className="bg-hoverAccent text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-semibold mb-4">Needle360</h1>
            <p className="text-gray-200">
              Your one-stop platform for customizable clothing and designs.
              Discover, create, and order unique apparel tailored just for you.
            </p>
          </div>

          {/* Links */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <ul className="text-gray-200">
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
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="https://facebook.com"
                className="text-gray-200 hover:text-white"
              >
                <i className="fab fa-facebook fa-2x"></i>
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-200 hover:text-white"
              >
                <i className="fab fa-instagram fa-2x"></i>
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-200 hover:text-white"
              >
                <i className="fab fa-twitter fa-2x"></i>
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-200 hover:text-white"
              >
                <i className="fab fa-linkedin fa-2x"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 border-t border-gray-400 pt-6 text-center">
          <p className="text-gray-200">
            &copy; {new Date().getFullYear()} Needle360. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
