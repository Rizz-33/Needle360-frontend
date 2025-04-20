import { motion } from "framer-motion";
import React from "react";
import { howItWorksConfig } from "../../configs/Services.configs";

const HowItWorks = () => {
  return (
    <div className="w-full max-w-7xl mx-auto pt-12 mt-28">
      <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
      <div className="flex items-center justify-between relative overflow-hidden">
        {howItWorksConfig.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.3 }}
            className="flex flex-col items-center w-1/3 text-center px-2 relative"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-primary text-white text-lg font-bold rounded-full mb-5">
              {index + 1}
            </div>
            <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
            <p className="text-gray-600 text-xs mx-24">{step.description}</p>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-8">
        <p className="text-gray-600 text-xs">
          Read our{" "}
          <a href="/blogs" className="text-primary underline">
            blogs
          </a>{" "}
          to have a better idea of how it works.
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;
