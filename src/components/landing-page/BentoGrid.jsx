import React from "react";
import { bentoGridConfigs } from "../../configs/Services.configs";

const BentoGrid = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24">
      {/* Single column on mobile, 2 columns on sm, 3 columns on md */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {bentoGridConfigs.map((card, index) => {
          const IconComponent = card.icon;

          return (
            <div
              key={index}
              className={`${card.className} relative group rounded-2xl sm:rounded-3xl p-4 transition-all duration-300 min-h-[180px] w-full mb-4 sm:mb-0`}
            >
              {/* Icon/Image */}
              {IconComponent ? (
                <IconComponent
                  className="absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 text-gray-500 opacity-50 transition-opacity group-hover:opacity-75"
                  aria-hidden="true"
                />
              ) : card.image ? (
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 opacity-50 object-contain"
                />
              ) : null}

              {/* Content */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-700 line-clamp-2 md:line-clamp-3">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BentoGrid;
