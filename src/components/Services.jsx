import React, { useEffect, useState } from "react";
import { useServiceStore } from "../store/Service.store";

const Services = ({ tailorId }) => {
  const { fetchServices, fetchAllServices, isLoading, error } =
    useServiceStore();

  const [hoveredService, setHoveredService] = useState(null);
  const [displayedServices, setDisplayedServices] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        let result;

        if (tailorId) {
          // Fetch services for a specific tailor
          result = await fetchServices(tailorId);
          console.log("Tailor services:", result);

          if (result && result.services) {
            setDisplayedServices(result.services);
          }
        } else {
          // Fetch all services from all tailors
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

  const handleServiceClick = (service) => {
    console.log(`Service clicked: ${service}`);
    // Add your service selection logic here
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!displayedServices || displayedServices.length === 0) {
    return <div className="text-center py-8">No services available</div>;
  }

  // Generate random pastel colors for services
  const getRandomPastelColor = (seed) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = hash % 360;
    return `hsl(${h}, 70%, 85%)`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto pt-8">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex flex-wrap justify-center gap-4 p-4">
          {displayedServices.map((service, index) => {
            // Simple string handling as seen in your data structure
            const serviceName = service;
            const bgColor = getRandomPastelColor(serviceName);

            return (
              <div
                key={`service-${index}`}
                className="relative cursor-pointer w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 hover:w-32 hover:h-32 hover:shadow-xl overflow-hidden border-2 border-secondary"
                style={{ backgroundColor: bgColor }}
                onClick={() => handleServiceClick(serviceName)}
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Service Name */}
                <span
                  className={`absolute text-xs text-center p-2 font-semibold transition-opacity duration-300 ${
                    hoveredService === index ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {serviceName}
                </span>

                {/* Visual effect on hover */}
                <div
                  className={`absolute inset-0 bg-secondary bg-opacity-20 transition-opacity duration-300 flex items-center justify-center ${
                    hoveredService === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-sm font-bold text-center p-2">
                    {serviceName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
