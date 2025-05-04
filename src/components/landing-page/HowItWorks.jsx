import { motion } from "framer-motion";
import React from "react";
import { howItWorksConfig } from "../../configs/Services.configs";

const HowItWorks = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-12 mt-12 mb-12 sm:mb-16 md:mb-20 lg:mb-24">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        How It Works
      </h2>

      {/* Stack vertically on mobile, horizontal on larger screens */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
        {howItWorksConfig.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`flex flex-col items-center w-full md:w-1/3 text-center px-2 relative ${
              index === howItWorksConfig.length - 1 ? "mb-6 md:mb-0" : ""
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-primary text-white text-base sm:text-lg font-bold rounded-full mb-3 sm:mb-5">
              {index + 1}
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mx-4 sm:mx-8 md:mx-4 lg:mx-8">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-6 sm:mt-8">
        <p className="text-gray-600 text-xs sm:text-sm">
          Read our{" "}
          <a
            href="/blogs"
            className="text-primary underline hover:text-primary-dark"
          >
            blogs
          </a>{" "}
          to have a better idea of how it works.
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;
