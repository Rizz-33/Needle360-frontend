import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-hoverAccent to-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:text-left">
            {/* Logo with hover effect and redirect on click */}
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

          <div className="text-center md:text-left">
            {/* Quick Links Section */}
            <h2 className="text-sm font-semibold mb-4">Quick Links</h2>
            <ul className="text-gray-200 text-[12px] space-y-2">
              <li>
                <a href="/" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            {/* Social Media Links */}
            <h2 className="text-sm font-semibold mb-4">Follow Us</h2>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="https://www.facebook.com/share/1YmX3DxxLB/?mibextid=wwXIfr"
                className="text-gray-200 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/needle360?igsh=NDlqdmJnMWxua2Qw"
                className="text-gray-200 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://x.com/ne360_"
                className="text-gray-200 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/risini-amarathunga/"
                className="text-gray-200 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-hoverAccent py-1 flex justify-between items-center">
        <p className="text-gray-400 text-[10px] px-3">
          needle360° All rights reserved.
        </p>
        <p className="text-gray-400 text-[10px] px-3">
          <a href="https://github.com/Rizz-33" className="hover:text-white">
            @Rizz-33
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
