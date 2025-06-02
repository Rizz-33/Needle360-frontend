import { AnimatePresence, motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { CustomButton } from "../components/ui/Button";
import Footer from "../components/ui/Footer";
import NavbarMenu from "../components/ui/Navbar-menu";
import { contactMethods } from "../configs/Services.configs";

const ConversationPopup = ({
  isOpen,
  onClose,
  title,
  description,
  expandedDetails,
  icon: Icon,
  position,
}) => {
  if (!isOpen) return null;

  const { top, left, width, height } = position || {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };
  const popupWidth = 320;
  const popupHeight = 300;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const spaceOnRight = viewportWidth - (left + width);
  const placeToRight = spaceOnRight >= popupWidth && viewportWidth > 640;

  let popupTop = top;
  let popupLeft = left + width + 16;

  if (!placeToRight) {
    popupTop = top + height + 16;
    popupLeft = left;
  }

  if (popupLeft + popupWidth > viewportWidth) {
    popupLeft = viewportWidth - popupWidth - 16;
  }
  if (popupTop + popupHeight > viewportHeight) {
    popupTop = viewportHeight - popupHeight - 16;
  }

  const isMobile = viewportWidth < 640;
  if (isMobile) {
    popupLeft = (viewportWidth - popupWidth) / 2;
    popupTop = (viewportHeight - popupHeight) / 2;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`fixed w-[90%] max-w-xs sm:max-w-sm md:max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-primary z-50 overflow-y-auto`}
          style={{
            top: popupTop,
            left: popupLeft,
            maxHeight: isMobile ? "80vh" : "400px",
          }}
        >
          <div className="sticky top-0 bg-primary/80 backdrop-blur-md p-3 sm:p-4 md:p-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white flex items-center">
              {Icon && (
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 text-white" />
              )}
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1"
              aria-label="Close popup"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </div>
          <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 md:space-y-4">
            <p className="text-xs sm:text-sm text-gray-600">{description}</p>
            <div className="border-t border-gray-200 pt-2 sm:pt-3 md:pt-4">
              <h4 className="text-xs sm:text-sm md:text-base font-medium text-gray-800 mb-1 sm:mb-2">
                More Details
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {expandedDetails}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Contact = () => {
  const [activeMethod, setActiveMethod] = useState("email");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const itemRefs = useRef({});

  const handleOpenPopup = (method, refKey) => {
    const element = itemRefs.current[refKey];
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const scrollLeft = window.scrollX || window.pageXOffset;

      setPopupPosition({
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        width: rect.width,
        height: rect.height,
      });
    }
    setSelectedMethod(method);
  };

  const handleClosePopup = () => {
    setSelectedMethod(null);
    setPopupPosition(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (selectedMethod) {
        const refKey = `method-${selectedMethod.id}`;
        const element = itemRefs.current[refKey];
        if (element) {
          const rect = element.getBoundingClientRect();
          const scrollTop = window.scrollY || window.pageYOffset;
          const scrollLeft = window.scrollX || window.pageXOffset;
          setPopupPosition({
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft,
            width: rect.width,
            height: rect.height,
          });
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [selectedMethod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-gray-50 flex flex-col pt-4">
      <NavbarMenu />
      <div className="absolute inset-0 bg-dot-black/[0.1] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100" />

      <div className="w-full mx-auto relative z-10">
        <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-24 w-full py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl -z-10" />
              <div className="relative bg-white/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-gray-200 shadow-lg p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4 sm:space-y-5 md:space-y-6">
                    <div className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-blue-50 border border-blue-200 text-primary text-xs sm:text-sm font-medium">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2" />
                      Get In Touch
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                      Let's Discuss Your <br className="hidden md:block" /> Next
                      Project
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm lg:text-base leading-relaxed">
                      Have a project in mind? I'm here to help turn your vision
                      into reality. Reach out through any of the methods below,
                      and let's start creating something amazing together.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative">
                      {contactMethods.map((method) => (
                        <motion.div
                          key={method.id}
                          ref={(el) =>
                            (itemRefs.current[`method-${method.id}`] = el)
                          }
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm border cursor-pointer ${
                            activeMethod === method.id
                              ? "bg-primary/10 border-primary/20 shadow-md"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setActiveMethod(method.id);
                            handleOpenPopup(method, `method-${method.id}`);
                          }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <method.icon
                            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mb-1.5 sm:mb-2 md:mb-3 ${
                              activeMethod === method.id
                                ? "text-primary"
                                : "text-gray-500"
                            }`}
                          />
                          <h4 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm md:text-base">
                            {method.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {method.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="relative mt-4 md:mt-0">
                    <div className="absolute inset-0 bg-grid-black/[0.02] rounded-2xl sm:rounded-3xl" />
                    <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 h-full">
                      <form
                        onSubmit={handleSubmit}
                        className="h-full space-y-4 sm:space-y-5"
                      >
                        <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                          Send a Message
                        </h4>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              placeholder="Your name"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="message"
                              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                            >
                              Message
                            </label>
                            <textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              rows={4}
                              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              placeholder="Tell me about your project..."
                              required
                            />
                          </div>
                          <CustomButton
                            text="Send Message"
                            color="primary"
                            hover_color="gray-300"
                            variant="outlined"
                            width="w-full"
                            height="h-9 sm:h-10"
                            type="submit"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
      {selectedMethod && (
        <ConversationPopup
          isOpen={!!selectedMethod}
          onClose={handleClosePopup}
          title={selectedMethod.title}
          description={selectedMethod.description}
          expandedDetails={selectedMethod.expandedDetails}
          icon={selectedMethod.icon}
          position={popupPosition}
        />
      )}
    </div>
  );
};

export default Contact;
