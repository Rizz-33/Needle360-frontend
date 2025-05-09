import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BsShop } from "react-icons/bs";
import { FaSearch, FaStar, FaTimes } from "react-icons/fa";
import { useShopStore } from "../../store/Shop.store";
import { CustomButton } from "../ui/Button";

const TailorSearchModal = ({ isOpen, onClose }) => {
  const { tailors, fetchTailors, isLoading, error } = useShopStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTailors, setFilteredTailors] = useState([]);

  // Fetch tailors on component mount
  useEffect(() => {
    if (isOpen) {
      fetchTailors();
    }
  }, [isOpen, fetchTailors]);

  // Update filtered tailors when search query changes or tailors are loaded
  useEffect(() => {
    if (tailors) {
      const filtered = tailors.filter(
        (tailor) =>
          tailor.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tailor.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Sort by ratings (for demonstration, assuming ratings exist)
      const sorted = [...filtered].sort(
        (a, b) =>
          (b.ratings?.averageRating || 0) - (a.ratings?.averageRating || 0)
      );

      setFilteredTailors(sorted);
    }
  }, [searchQuery, tailors]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const viewTailorProfile = (id) => {
    window.location.href = `/tailor/${id}`;
  };

  // Mock ratings for demonstration
  const getRating = (tailor) => {
    return tailor.ratings?.averageRating || Math.floor(Math.random() * 5) + 1;
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, i) => (
        <FaStar
          key={i}
          className={`${
            i < rating ? "text-yellow-400" : "text-gray-300"
          } w-4 h-4`}
        />
      ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Find a Tailor
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or shop name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Tailors List */}
            <div
              className="overflow-y-auto p-4"
              style={{ maxHeight: "calc(80vh - 140px)" }}
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">{error}</div>
              ) : filteredTailors.length === 0 ? (
                <div className="text-center text-gray-500 p-4">
                  {searchQuery
                    ? "No tailors match your search"
                    : "No tailors available"}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTailors.map((tailor) => (
                    <motion.div
                      key={tailor._id}
                      whileHover={{ scale: 1.02 }}
                      className="flex bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                      <div className="w-24 h-24 flex items-center justify-center bg-gray-50">
                        {tailor.logoUrl ? (
                          <img
                            src={tailor.logoUrl}
                            alt={tailor.shopName}
                            className="w-20 h-20 object-contain"
                          />
                        ) : (
                          <BsShop className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 p-4">
                        <h3 className="font-semibold text-md">
                          {tailor.shopName || tailor.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          {renderStars(getRating(tailor))}
                          <span className="ml-1 text-xs text-gray-500">
                            (
                            {tailor.ratings?.count ||
                              Math.floor(Math.random() * 100)}{" "}
                            reviews)
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {tailor.shopAddress || "Address not available"}
                        </p>
                        <div className="mt-2">
                          <CustomButton
                            text="View Profile"
                            color="primary"
                            variant="filled"
                            width="w-full"
                            height="h-8"
                            fontSize="text-xs"
                            onClick={() => viewTailorProfile(tailor._id)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TailorSearchModal;
