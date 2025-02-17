import { motion } from "framer-motion";
import React from "react";

const steps = [
  {
    title: "Upload or Design",
    description:
      "Upload your design, create a new one, or customize an existing template. Use our intuitive design tools to bring your vision to life. Access a wide range of design elements and templates to make your creation unique.",
  },
  {
    title: "Choose Tailor",
    description:
      "Select tailors near you based on reviews, expertise, and location. Compare them to find the best match for your needs. View their portfolios and read customer testimonials to make an informed decision.",
  },
  {
    title: "Order and Get It Delivered",
    description:
      "Place your order and have your custom outfit crafted and delivered to your doorstep. Track your order in real-time and receive updates on the progress. Enjoy a seamless hassle-free experience with our reliable delivery service.",
  },
];

const HowItWorks = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
      <div className="flex items-center justify-between relative overflow-hidden">
        {steps.map((step, index) => (
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
            {/* {index < steps.length - 1 && (
              <div className="absolute top-1/2 left-full w-12 h-1 bg-primary transform -translate-y-1/2"></div>
            )} */}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
