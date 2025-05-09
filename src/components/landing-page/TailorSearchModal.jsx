import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BsShop } from "react-icons/bs";
import { FaSearch, FaStar, FaTimes } from "react-icons/fa";
import { useShopStore } from "../../store/Shop.store";
import { CustomButton } from "../ui/Button";
import Loader from "../ui/Loader";

const TailorSearchModal = ({ isOpen, onClose }) => {
  const { tailors, fetchTailors, isLoading, error } = useShopStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTailors, setFilteredTailors] = useState([]);

  // Color scheme
  const colors = {
    background: "#F9FAFB",
    cardHover: "#F3F4F6",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
  };

  useEffect(() => {
    if (isOpen) {
      fetchTailors();
    }
  }, [isOpen, fetchTailors]);

  useEffect(() => {
    if (tailors) {
      const filtered = tailors.filter(
        (tailor) =>
          tailor.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tailor.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );

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

  const getRating = (tailor) => {
    return tailor.ratings?.averageRating || Math.floor(Math.random() * 5) + 1;
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, i) => (
        <FaStar
          key={i}
          className={`${
            i < rating ? "text-yellow-400" : "text-gray-200"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary to-hoverAccent">
              <div>
                <h2 className="text-2xl font-bold text-white">Find a Tailor</h2>
                <p className="text-secondary text-sm mt-1">
                  Discover professional tailors near you
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <FaTimes className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-100">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <motion.input
                  type="text"
                  placeholder="Search by name or shop name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full text-sm py-3 pl-10 pr-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  whileFocus={{
                    boxShadow: `0 0 0 3px ${colors.primary}20`,
                    borderColor: colors.primary,
                  }}
                />
              </div>
            </div>

            {/* Tailors List */}
            <div
              className="overflow-y-auto p-6 bg-gray-50"
              style={{ maxHeight: "calc(80vh - 160px)" }}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                  <Loader />
                </div>
              ) : error ? (
                <div className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <FaTimes className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-red-500 max-w-md mx-auto">{error}</p>
                </div>
              ) : filteredTailors.length === 0 ? (
                <div className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <BsShop className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    {searchQuery ? "No results found" : "No tailors available"}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto text-xs">
                    {searchQuery
                      ? "Try a different search term"
                      : "Check back later for available tailors"}
                  </p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {filteredTailors.map((tailor) => (
                    <motion.div
                      key={tailor._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:border-gray-200 transition-all"
                    >
                      <div className="w-24 h-full flex items-center justify-center bg-gray-50 p-2">
                        {tailor.logoUrl ? (
                          <motion.img
                            src={tailor.logoUrl}
                            alt={tailor.shopName}
                            className="w-16 h-16 object-contain rounded-lg"
                            whileHover={{ scale: 1.05 }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                            <BsShop className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">
                            {tailor.shopName || tailor.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Available
                          </span>
                        </div>
                        <div className="flex items-center mt-2">
                          {renderStars(getRating(tailor))}
                          <span className="ml-2 text-xs text-gray-500">
                            {tailor.ratings?.count ||
                              Math.floor(Math.random() * 100)}{" "}
                            reviews
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {tailor.shopAddress || "Address not available"}
                        </p>
                        <div className="mt-4">
                          <CustomButton
                            text="View Profile"
                            color="primary"
                            variant="filled"
                            width="w-full"
                            height="h-9"
                            fontSize="text-sm"
                            onClick={() => viewTailorProfile(tailor._id)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TailorSearchModal;
