// components/steps/BasicInfoStep.jsx
import { motion } from "framer-motion";
import React from "react";
import { FaUpload } from "react-icons/fa";
import Loader from "../ui/Loader";

const BasicInfoStep = ({
  profileImage,
  businessName,
  bio,
  isLoading,
  handleImageUpload,
  setBusinessName,
  setBio,
}) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Basic Information
      </h2>

      {/* Profile Photo */}
      <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
        <div className="flex-shrink-0">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden bg-secondary/20 cursor-pointer relative group"
            onClick={() => document.getElementById("profile-upload").click()}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl text-secondary">
                <FaUpload className="h-24" />
              </span>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm">Change Photo</span>
            </div>
          </div>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <p className="text-center mt-2 text-xs text-gray-500">
            Click to change
          </p>
        </div>

        <div className="flex-grow w-full">
          <div className="mb-4">
            <label
              htmlFor="businessName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              className="w-full text-xs px-4 py-2 border border-gray-300 rounded-full focus:ring-primary focus:border-primary transition-colors"
              placeholder="Your Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio
            </label>
            <textarea
              id="bio"
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-full text-xs focus:ring-primary focus:border-primary transition-colors"
              placeholder="Tell customers about your business..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-2">
          <Loader />
        </div>
      )}
    </motion.div>
  );
};

export default BasicInfoStep;
