// components/ProfileStepper.jsx
import React from "react";

const ProfileStepper = ({ steps, currentStep }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative flex-1 flex flex-col items-center"
          >
            {/* Connector line */}
            {index > 0 && (
              <div
                className={`absolute top-4 w-full h-1 -left-1/2 ${
                  index <= currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              ></div>
            )}

            {/* Step circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                index < currentStep
                  ? "bg-primary text-white text-sm"
                  : index === currentStep
                  ? "bg-primary text-white text-sm"
                  : "bg-gray-200 text-gray-600 text-xs"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>

            {/* Step title */}
            <div className="text-[10px] font-medium mt-1 text-center">
              {step.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStepper;
