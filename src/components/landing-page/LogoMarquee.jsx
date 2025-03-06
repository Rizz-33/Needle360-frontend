import React, { useEffect } from "react";
import { useShopStore } from "../../store/Shop.store";

const LogoMarquee = () => {
  const { tailors, isLoading, error, fetchTailors } = useShopStore();

  useEffect(() => {
    fetchTailors();
  }, [fetchTailors]);

  // Extract logos from tailors data
  const logos = tailors
    .map((tailor) => ({
      url: tailor.logoUrl,
      name: tailor.shopName || "Shop Logo",
    }))
    .filter((logo) => logo.url); // Remove empty/null logos

  if (isLoading || error || !logos.length) {
    return null;
  }

  return (
    <div className="w-full flex overflow-hidden bg-transparent pt-12">
      <div className="flex items-center gap-20 marquee">
        <div className="flex space-x-10">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo.url}
              alt={`${logo.name} Logo`}
              className="h-12 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/48/48";
              }}
            />
          ))}
        </div>
        <div className="flex space-x-10">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo.url}
              alt={`${logo.name} Logo`}
              className="h-12 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/48/48";
              }}
            />
          ))}
        </div>
        <div className="flex space-x-10">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo.url}
              alt={`${logo.name} Logo`}
              className="h-12 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/48/48";
              }}
            />
          ))}
        </div>
        <div className="flex space-x-10">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo.url}
              alt={`${logo.name} Logo`}
              className="h-12 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/48/48";
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
