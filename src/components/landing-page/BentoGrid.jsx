import React from "react";
import { bentoGridConfigs } from "../../configs/Services.configs";

const BentoGrid = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
        {bentoGridConfigs.map((card, index) => (
          <div
            key={index}
            className={`${card.className} relative group rounded-3xl p-4 transition-all duration-300 hover:transform hover:scale-[1.02]`}
          >
            {card.image && (
              <img
                src={card.image}
                alt={card.title}
                className="absolute top-4 right-4 w-16 h-16 opacity-50"
              />
            )}
            <div className="relative h-full flex flex-col justify-end">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-700">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BentoGrid;
