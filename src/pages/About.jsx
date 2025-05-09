import { AnimatePresence, motion } from "framer-motion";
import { Code, Database, Layout, Rocket, Users, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/ui/Footer";
import NavbarMenu from "../components/ui/Navbar-menu";
import { aboutAppConfigs, aboutMeConfigs } from "../configs/Services.configs";

// Conversational Popup Component
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

  // Determine popup position (try to place to the right, fall back to below if not enough space)
  const popupWidth = 320;
  const popupHeight = 300;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Check if there's enough space to the right
  const spaceOnRight = viewportWidth - (left + width);
  const placeToRight = spaceOnRight >= popupWidth && viewportWidth > 640;

  // Calculate position
  let popupTop = top;
  let popupLeft = left + width + 16;

  if (!placeToRight) {
    // If not enough space on the right, place below the element
    popupTop = top + height + 16;
    popupLeft = left;
  }

  // Ensure the popup doesn't go off-screen
  if (popupLeft + popupWidth > viewportWidth) {
    popupLeft = viewportWidth - popupWidth - 16;
  }
  if (popupTop + popupHeight > viewportHeight) {
    popupTop = viewportHeight - popupHeight - 16;
  }

  // On mobile (viewportWidth < 640), center the popup
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

const About = () => {
  const [activeFeature, setActiveFeature] = useState("planning");
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const itemRefs = useRef({}); // Store refs for each item

  const handleOpenPopup = (item, refKey) => {
    const element = itemRefs.current[refKey];
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const scrollLeft = window.scrollX || window.pageXOffset;

      // Calculate position relative to the viewport, adjusted for scroll
      setPopupPosition({
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        width: rect.width,
        height: rect.height,
      });
    }
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
    setPopupPosition(null);
  };

  // Reset popup position on window resize to prevent misalignment
  useEffect(() => {
    const handleResize = () => {
      if (selectedItem) {
        const refKey = selectedItem.id
          ? `sdlc-${selectedItem.id}`
          : `bento-${aboutAppConfigs.findIndex(
              (item) => item.title === selectedItem.title
            )}`;
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
  }, [selectedItem]);

  return (
    <div className="h-screen w-full overflow-y-auto bg-gray-50 flex flex-col pt-4">
      <NavbarMenu />

      {/* Background patterns */}
      <div className="absolute inset-0 bg-dot-black/[0.1] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100" />

      <div className="w-full mx-auto relative z-10">
        <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-24 w-full py-8 sm:py-12 md:py-16 lg:py-20">
          {/* Section 1: About the App */}
          <div className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl -z-10" />
              <div className="relative bg-white/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-gray-200 shadow-lg p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                  <div className="inline-flex items-center px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-50 border border-blue-200 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2" />
                    About Our App
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    Connecting Tailors & Customers in Sri Lanka
                  </h2>
                  <p className="mt-2 sm:mt-3 md:mt-4 text-gray-600 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto">
                    Discover a platform that bridges the gap between tailors and
                    customers, offering tools for design, customization, and
                    order management.
                  </p>
                </div>

                {/* Bento Grid Layout - Improved responsiveness */}
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 relative">
                  {aboutAppConfigs.map((item, index) => (
                    <motion.div
                      key={index}
                      ref={(el) => (itemRefs.current[`bento-${index}`] = el)}
                      className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-300 cursor-pointer ${
                        /* Apply cols span for larger items on different breakpoints */
                        item.className.includes("col-span-2")
                          ? "xs:col-span-2 md:col-span-2 lg:col-span-2"
                          : ""
                      } ${
                        /* Custom background color from original design */
                        item.className.match(/bg-\[#[A-Za-z0-9]+\]/) ||
                        "bg-white"
                      }`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleOpenPopup(item, `bento-${index}`)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl sm:rounded-2xl" />
                      <div className="relative">
                        {item.icon && (
                          <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-primary/80 mb-2 sm:mb-3 opacity-80" />
                        )}
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Section 2: About Me */}
          <div className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl -z-10" />
              <div className="relative bg-white/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-gray-200 shadow-lg p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4 sm:space-y-5 md:space-y-6">
                    <div className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs sm:text-sm font-medium">
                      <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2" />
                      About Me
                    </div>

                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                      Full-Stack Web <br className="hidden md:block" />{" "}
                      Development Specialist
                    </h3>

                    <p className="text-gray-700 text-xs sm:text-sm lg:text-base leading-relaxed">
                      I'm a dedicated web developer specializing in the complete
                      software development lifecycle. From initial concept and
                      planning through to deployment and maintenance, I create
                      innovative, scalable web applications with modern
                      technologies.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative">
                      {aboutMeConfigs.map((feature) => (
                        <motion.div
                          key={feature.id}
                          ref={(el) =>
                            (itemRefs.current[`sdlc-${feature.id}`] = el)
                          }
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm border cursor-pointer ${
                            activeFeature === feature.id
                              ? "bg-primary/10 border-primary/20 shadow-md"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setActiveFeature(feature.id);
                            handleOpenPopup(feature, `sdlc-${feature.id}`);
                          }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <feature.icon
                            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mb-1.5 sm:mb-2 md:mb-3 ${
                              activeFeature === feature.id
                                ? "text-primary"
                                : "text-gray-500"
                            }`}
                          />
                          <h4 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm md:text-base">
                            {feature.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {feature.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="relative mt-4 md:mt-0">
                    <div className="absolute inset-0 bg-grid-black/[0.02] rounded-2xl sm:rounded-3xl" />
                    <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 h-full">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 h-full">
                        <div className="space-y-3 sm:space-y-4 md:space-y-5">
                          <div className="bg-white/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <Layout className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary opacity-80 mb-1.5 sm:mb-2 md:mb-3" />
                            <h4 className="text-gray-900 font-medium mb-1 text-xs sm:text-sm md:text-base">
                              Modern Frontend
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500">
                              React, Next.js, and responsive design for optimal
                              user experiences
                            </p>
                          </div>
                          <div className="bg-white/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <Database className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary opacity-80 mb-1.5 sm:mb-2 md:mb-3" />
                            <h4 className="text-gray-900 font-medium mb-1 text-xs sm:text-sm md:text-base">
                              Robust Backend
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Scalable architecture with Node.js, SQL and NoSQL
                              databases
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3 sm:space-y-4 md:space-y-5 mt-4 sm:mt-6 md:mt-8">
                          <div className="bg-white/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <Rocket className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary mb-1.5 sm:mb-2 md:mb-3" />
                            <h4 className="text-gray-900 font-medium mb-1 text-xs sm:text-sm md:text-base">
                              DevOps Integration
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500">
                              CI/CD pipelines, Docker, and cloud deployment
                              expertise
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Conversational Popup */}
      {selectedItem && (
        <ConversationPopup
          isOpen={!!selectedItem}
          onClose={handleClosePopup}
          title={selectedItem.title}
          description={selectedItem.description}
          expandedDetails={selectedItem.expandedDetails}
          icon={selectedItem.icon}
          position={popupPosition}
        />
      )}
    </div>
  );
};

export default About;
