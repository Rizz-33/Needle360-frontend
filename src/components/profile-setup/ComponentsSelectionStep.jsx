// components/steps/ComponentsSelectionStep.jsx
import { motion } from "framer-motion";
import React from "react";

const ComponentsSelectionStep = ({ components, toggleComponent }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        Customize Your Profile
      </h2>
      <p className="text-gray-600 mb-6 text-xs">
        Select which components to display on your business profile
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {components.map((component) => (
          <motion.div
            key={component.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
              component.enabled
                ? "border-secondary/20 bg-blue-50"
                : "border-gray-200 hover:border-secondary"
            }`}
            onClick={() => toggleComponent(component.id)}
          >
            <div className="flex items-center">
              <span className="text-xl mr-3">{component.icon}</span>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800 text-sm">
                  {component.title}
                </h3>
                <p className="text-gray-500 text-xs">
                  {component.isClientGenerated
                    ? "Let customers leave reviews"
                    : `Show ${component.title.toLowerCase()} on your profile`}
                </p>
              </div>
              <div
                className={`w-10 h-6 rounded-full p-1 transition-colors ${
                  component.enabled ? "bg-primary/50" : "bg-gray-200"
                }`}
              >
                <motion.div
                  className="bg-white w-4 h-4 rounded-full shadow-md"
                  animate={{
                    x: component.enabled ? 16 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ComponentsSelectionStep;
