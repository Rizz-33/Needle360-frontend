import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import Loader from "../../components/ui/Loader";

const PendingApproval = () => {
  const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false);

  const openHelpPopup = () => {
    setIsHelpPopupOpen(true);
  };

  const closeHelpPopup = () => {
    setIsHelpPopupOpen(false);
  };

  return (
    <div className="bg-grid-gray-300/[0.2] min-h-screen w-full to-violet-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100 relative">
        <h1 className="text-lg font-bold text-primary mb-3">Please Wait</h1>
        <p className="text-xs text-gray-500 mb-8">
          Your request is being reviewed by our team. This won't take long.
        </p>

        <div className="flex justify-center">
          <Loader />
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Please don't refresh the page while we process your request.
        </p>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={openHelpPopup}
            className="text-xs text-primary hover:text-primary/80 transition-colors duration-300 flex items-center justify-center mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Need help?
          </button>
        </div>
      </div>

      <div className="text-xs text-primary/40 mt-8">
        If you need immediate assistance, please contact
        <a
          href="mailto:needle360.app@gmail.com"
          className="text-primary hover:text-primary/80 ml-1"
        >
          needle360.app@gmail.com
        </a>
      </div>

      <AnimatePresence>
        {isHelpPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={closeHelpPopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeHelpPopup}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-lg font-bold text-primary my-4">
                Processing Your Request
              </h2>

              <p className="text-[13px] text-gray-600 mb-4">
                We're carefully reviewing your request to ensure the highest
                quality of service. This process typically takes between a few
                minutes to 3 business days.
              </p>

              <p className="text-xs text-gray-500 mb-8">
                We appreciate your patience. Our thorough review is part of our
                commitment to delivering an exceptional customer experience.
              </p>

              <div className="bg-primary/10 rounded-xl p-4 text-center mb-4">
                <p className="text-xs text-gray-600 mb-2">
                  For more insights and updates, we recommend:
                </p>
                <div className="flex justify-center space-x-10">
                  <a href="#" className="text-xs text-primary hover:underline">
                    Read Our Blog
                  </a>
                  <a
                    href="mailto:needle360.app@gmail.com"
                    className="text-xs text-primary hover:underline"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingApproval;
