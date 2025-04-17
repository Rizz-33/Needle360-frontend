import { AnimatePresence, motion } from "framer-motion";
import {
  Baby,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  MessageSquare,
  PenTool,
  Phone,
  Scissors,
  Shirt,
  Sparkles,
  Users,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { CustomButton } from "../components/ui/Button";
import { useChatStore } from "../store/Chat.store"; // Import useChatStore
import { useServiceStore } from "../store/Service.store";
import Loader from "./ui/Loader";

const Services = ({ tailorId }) => {
  const {
    fetchServices,
    fetchAllServices,
    fetchTailorsByService,
    isLoading,
    error,
  } = useServiceStore();
  const { startNewConversation, setChatOpen } = useChatStore(); // Access chat store functions
  const [displayedServices, setDisplayedServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [filteredTailors, setFilteredTailors] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
      return () => container.removeEventListener("scroll", checkScrollPosition);
    }
  }, [displayedServices]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        let result;
        if (tailorId) {
          result = await fetchServices(tailorId);
          console.log("Tailor services:", result);
          if (result && result.services) {
            setDisplayedServices(result.services);
          }
        } else {
          result = await fetchAllServices();
          console.log("All services:", result);
          if (result && result.services) {
            setDisplayedServices(result.services);
          }
        }
      } catch (error) {
        console.error("Error loading services:", error);
      }
    };
    loadServices();
  }, [tailorId, fetchServices, fetchAllServices]);

  useEffect(() => {
    const loadTailorsForService = async () => {
      if (selectedService) {
        try {
          const serviceTailors = await fetchTailorsByService(selectedService);
          console.log(`Tailors for ${selectedService}:`, serviceTailors);
          setFilteredTailors(serviceTailors);
        } catch (error) {
          console.error(
            `Error fetching tailors for ${selectedService}:`,
            error
          );
          setFilteredTailors([]);
        }
      } else {
        setFilteredTailors([]);
      }
    };
    loadTailorsForService();
  }, [selectedService, fetchTailorsByService]);

  const handleServiceClick = (service) => {
    console.log(`Service clicked: ${service}`);
    setSelectedService(service === selectedService ? null : service);
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleMessageTailor = (tailor) => {
    console.log(`Starting chat with tailor: ${tailor._id}`);
    startNewConversation(tailor._id); // Start a new conversation with the tailor
    setChatOpen(true); // Open the ChatPopup
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 rounded-xlg bg-red-50 text-red-600 p-4 max-w-md mx-auto">
        <p className="font-medium">Unable to load services</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!displayedServices || displayedServices.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="mt-4 font-medium">No services available</p>
        <p className="mt-1 text-sm">Check back later for service offerings</p>
      </div>
    );
  }

  const serviceIcons = {
    "School Uniforms": Shirt,
    "Saree Blouses": Sparkles,
    "Wedding Attire": Heart,
    "Office Wear": Briefcase,
    "National Dress": Users,
    "Formal Wear": Shirt,
    "Casual Wear": Scissors,
    Kidswear: Baby,
    "Religious/Cultural Outfits": Users,
    "Custom Fashion Designs": PenTool,
  };

  const categoryColors = {
    primary: ["bg-indigo-100", "text-indigo-800", "border-indigo-200"],
    secondary: ["bg-purple-100", "text-purple-800", "border-purple-200"],
    accent: ["bg-amber-100", "text-amber-800", "border-amber-200"],
    neutral: ["bg-gray-100", "text-gray-800", "border-gray-200"],
    info: ["bg-teal-100", "text-teal-800", "border-teal-200"],
  };

  const colorOptions = Object.values(categoryColors);
  const getServiceColor = (index) => colorOptions[index % colorOptions.length];

  return (
    <div className="w-full max-w-7xl mx-auto pt-4 pb-8 px-4">
      <div className="relative">
        <div
          className={`absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        ></div>
        <div
          className={`absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <div
          ref={scrollContainerRef}
          className="relative overflow-x-auto scrollbar-hide snap-x snap-mandatory flex space-x-4 pt-4 pb-6"
        >
          {displayedServices.map((service, index) => {
            const serviceName = service;
            const [bgColor, textColor, borderColor] = getServiceColor(index);
            const isSelected = selectedService === serviceName;
            const Icon = serviceIcons[serviceName] || Scissors;

            return (
              <motion.div
                key={`service-${index}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  snap-center flex-shrink-0 w-48 h-48 cursor-pointer rounded-3xl p-6 flex flex-col items-center justify-center
                  transition-all duration-300 border ${borderColor}
                  ${isSelected ? "ring-2 ring-offset-2 ring-indigo-600" : ""}
                  ${bgColor} shadow-lg hover:shadow-xl
                `}
                onClick={() => handleServiceClick(serviceName)}
              >
                <div
                  className={`w-12 h-12 mb-4 flex items-center justify-center rounded-full ${textColor} bg-white bg-opacity-80`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className={`text-sm font-semibold text-center ${textColor}`}
                >
                  {serviceName}
                </span>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              whileHover={{ scale: 1.1 }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-2 shadow-md z-20"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          )}
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              whileHover={{ scale: 1.1 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-2 shadow-md z-20"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {selectedService && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 p-6 bg-white rounded-3xl shadow-lg max-w-4xl mx-auto"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {selectedService}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Discover our {selectedService.toLowerCase()} service. Contact us to
            schedule an appointment or request a quote.
          </p>
          <div className="mt-4 flex space-x-3">
            <CustomButton
              text="Book Now"
              variant="filled"
              color="primary"
              hover_color="hoverAccent"
              width="w-24"
              height="h-10"
              type="submit"
              onClick={() => (window.location.href = "/book-appointment")}
            />
            <CustomButton
              text="Request Info"
              variant="outline"
              color="primary"
              hover_color="hoverAccent"
              width="w-24"
              height="h-10"
              type="submit"
              onClick={() => (window.location.href = "/book-appointment")}
            />
          </div>

          <div className="mt-8">
            <h4 className="text-md font-semibold text-gray-800 mb-4">
              Tailors Specializing in {selectedService}
            </h4>
            {filteredTailors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTailors.map((tailor) => (
                  <motion.div
                    key={tailor._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 rounded-2xl shadow-sm flex flex-col"
                  >
                    <div className="flex items-center mb-3">
                      {tailor.logoUrl ? (
                        <img
                          src={tailor.logoUrl}
                          alt={`${tailor.shopName} logo`}
                          className="w-12 h-12 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <Scissors className="h-6 w-6 text-indigo-600" />
                        </div>
                      )}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-800">
                          {tailor.shopName || tailor.name || "Unknown"}
                        </h5>
                        <p className="text-xs text-gray-500">
                          {tailor.shopAddress || "Address not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {tailor.contactNumber && (
                        <a
                          href={`tel:${tailor.contactNumber}`}
                          className="p-2 bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors"
                          title="Call"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      {tailor.email && (
                        <a
                          href={`mailto:${tailor.email}`}
                          className="p-2 bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors"
                          title="Email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleMessageTailor(tailor)}
                        className="p-2 bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors"
                        title="Message"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No tailors currently offer {selectedService}. Check back later!
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Services;
