import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const WelcomeScreen = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="flex items-center justify-center min-h-screen absolute inset-0 z-10 bg-grid-gray-300/[0.2]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center px-6"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-hoverAccent bg-clip-text text-transparent"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: 1,
              duration: 1.5,
            }}
          >
            Let's Get Started!
          </motion.h1>
          <motion.p
            className="mt-3 text-sm text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Let's make your business profile
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeScreen;
