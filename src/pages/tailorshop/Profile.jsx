import { motion } from "framer-motion";
import { MessageCircleMore } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  FaBookmark,
  FaCalendarAlt,
  FaChevronLeft,
  FaEdit,
  FaMapMarkerAlt,
  FaPalette,
  FaStar,
  FaTag,
  FaTools,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import { useAuthStore } from "../../store/Auth.store";
import { useShopStore } from "../../store/Shop.store";

const TailorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tailor, fetchTailorById } = useShopStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("designs");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showAllBio, setShowAllBio] = useState(false);

  // Determine if this is the user's own profile
  const isOwnProfile = !id || (user && (user._id === id || user.id === id));

  // Fetch tailor data on component mount
  useEffect(() => {
    const tailorId = id || (user && (user._id || user.id));
    if (tailorId) {
      fetchTailorById(tailorId);
    }
  }, [fetchTailorById, id, user]);

  if (!tailor) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-secondary/20 to-blue-100 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Calculate average rating
  const avgRating =
    tailor.reviews && tailor.reviews.length > 0
      ? tailor.reviews.reduce(
          (acc, review) => acc + (parseFloat(review.rating) || 0),
          0
        ) / tailor.reviews.length
      : 0;

  // Format rating to one decimal place
  const formattedRating = avgRating.toFixed(1);

  // Truncate bio for display
  const truncatedBio =
    tailor.bio && tailor.bio.length > 100 && !showAllBio
      ? tailor.bio.substring(0, 100) + "..."
      : tailor.bio;

  const goBack = () => {
    navigate(-1);
  };

  const handleFollow = () => {
    if (!isOwnProfile) {
      setIsFollowing(!isFollowing);
    }
  };

  const handleSave = () => {
    if (!isOwnProfile) {
      setIsSaved(!isSaved);
    }
  };

  const handleEditProfile = () => {
    // Navigate to edit profile page
    navigate("/profile-setup");
  };

  const toggleBio = () => {
    setShowAllBio(!showAllBio);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case "designs":
        return (
          <div className="grid grid-cols-3 gap-1">
            {tailor.designs && tailor.designs.length > 0 ? (
              tailor.designs.map((design, index) => (
                <motion.div
                  key={design.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="aspect-square bg-gray-100 relative overflow-hidden group"
                >
                  {design.image ? (
                    <img
                      src={design.image}
                      alt={design.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <FaPalette className="text-gray-400 text-2xl" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-white font-medium text-sm">
                      {design.title}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 py-10 text-center text-gray-500">
                <FaPalette className="text-3xl mx-auto mb-2 text-gray-300" />
                <p>No designs to display</p>
                {isOwnProfile && (
                  <button className="mt-3 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                    Add Your First Design
                  </button>
                )}
              </div>
            )}
          </div>
        );
      case "services":
        return (
          <div className="space-y-3">
            {tailor.services && tailor.services.length > 0 ? (
              tailor.services.map((service, index) => (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-4 rounded-xl shadow-sm"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">
                      {service.title}
                    </h3>
                    <span className="font-bold text-primary">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {service.description}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-500">
                <FaTools className="text-3xl mx-auto mb-2 text-gray-300" />
                <p>No services to display</p>
                {isOwnProfile && (
                  <button className="mt-3 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                    Add Your Services
                  </button>
                )}
              </div>
            )}
          </div>
        );
      case "offers":
        return (
          <div className="space-y-3">
            {tailor.offers && tailor.offers.length > 0 ? (
              tailor.offers.map((offer, index) => (
                <motion.div
                  key={offer.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl shadow-sm border border-primary/10"
                >
                  <div className="flex">
                    {offer.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                        <img
                          src={offer.image}
                          alt={offer.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-2 inline-block">
                        Special Offer
                      </span>
                      <h3 className="font-medium text-gray-800">
                        {offer.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {offer.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-500">
                <FaTag className="text-3xl mx-auto mb-2 text-gray-300" />
                <p>No offers currently available</p>
                {isOwnProfile && (
                  <button className="mt-3 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                    Create Special Offer
                  </button>
                )}
              </div>
            )}
          </div>
        );
      case "reviews":
        return (
          <div className="space-y-3">
            {tailor.reviews && tailor.reviews.length > 0 ? (
              tailor.reviews.map((review, index) => (
                <motion.div
                  key={review.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-4 rounded-xl shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {review.reviewer || review.clientName}
                      </h3>
                      <div className="flex text-yellow-400 mt-1">
                        {Array.from({
                          length: parseInt(review.rating) || 5,
                        }).map((_, i) => (
                          <FaStar key={i} className="text-sm" />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {review.comment || review.text}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-500">
                <FaStar className="text-3xl mx-auto mb-2 text-gray-300" />
                <p>No reviews yet</p>
                {!isOwnProfile && (
                  <button className="mt-3 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                    Leave a Review
                  </button>
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-3 flex items-center justify-between border-b">
        {/* Back Button with Zoom Effect */}
        <motion.button
          onClick={goBack}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-800 hover:text-primary transition-colors duration-200"
        >
          <FaChevronLeft />
        </motion.button>

        <h1 className="font-semibold">{tailor.shopName}</h1>

        {/* Edit Button with Zoom Effect */}
        {isOwnProfile && (
          <motion.button
            onClick={handleEditProfile}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-800 flex items-center gap-1 hover:text-primary transition-colors duration-200"
          >
            <FaEdit size={14} />
          </motion.button>
        )}
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pt-14 pb-16 bg-grid-gray-200/[0.2]">
        {/* Cover image */}
        <div className="h-32 bg-gradient-to-r from-blue-100 to-orange-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
        </div>

        {/* Profile section */}
        <div className="px-16 relative">
          {/* Profile image */}
          <div className="relative -mt-16 mb-4 flex justify-between">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              {tailor.logoUrl ? (
                <img
                  src={tailor.logoUrl}
                  alt={tailor.shopName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xl font-bold">
                  {tailor.shopName?.charAt(0)}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-end gap-2">
              {isOwnProfile ? (
                ""
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className={`p-2 rounded-full ${
                      isSaved ? "bg-gray-100 text-primary" : "text-gray-500"
                    }`}
                  >
                    <FaBookmark
                      className={isSaved ? "fill-current" : "fill-current"}
                    />
                  </button>
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                      isFollowing
                        ? "bg-gray-200 text-gray-800"
                        : "bg-primary text-white"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile info */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              {tailor.shopName}
            </h1>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="font-semibold text-gray-900 mr-1">1.2k</span>{" "}
                followers
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-900 mr-1">
                  {tailor.designs?.length || 0}
                </span>{" "}
                designs
              </div>
              {avgRating > 0 && (
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-semibold text-gray-900">
                    {formattedRating}
                  </span>
                </div>
              )}
            </div>

            {/* Bio */}
            {tailor.bio && (
              <div className="mt-2">
                <p className="text-sm text-gray-700">{truncatedBio}</p>
                {tailor.bio.length > 100 && (
                  <button
                    onClick={toggleBio}
                    className="text-primary text-sm font-medium mt-1"
                  >
                    {showAllBio ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}

            {/* Address and Availability */}
            <div className="mt-3 flex flex-wrap gap-y-2">
              {tailor.shopAddress && (
                <div className="flex items-center text-xs text-gray-500 mr-4">
                  <FaMapMarkerAlt className="text-primary mr-1" />
                  <span>{tailor.shopAddress}</span>
                </div>
              )}

              {tailor.availability && tailor.availability.length > 0 && (
                <div className="flex items-center text-xs text-gray-500">
                  <FaCalendarAlt className="text-primary mr-1" />
                  <span>
                    Open {tailor.availability[0].day} ·{" "}
                    {tailor.availability[0].hours}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Story highlights */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-4 py-2">
              {["Bestsellers", "New Arrivals", "Process", "Customer Fits"].map(
                (highlight, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center bg-gray-50">
                      <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                          {index === 0 && <FaTag className="text-gray-400" />}
                          {index === 1 && (
                            <FaPalette className="text-gray-400" />
                          )}
                          {index === 2 && <FaTools className="text-gray-400" />}
                          {index === 3 && <FaStar className="text-gray-400" />}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs mt-1">{highlight}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-16 border-t sticky top-14 bg-white z-10">
          <div className="flex">
            {[
              { id: "designs", label: "Designs", icon: <FaPalette /> },
              { id: "services", label: "Services", icon: <FaTools /> },
              { id: "offers", label: "Offers", icon: <FaTag /> },
              { id: "reviews", label: "Reviews", icon: <FaStar /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 flex flex-col items-center ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500"
                }`}
              >
                {tab.icon}
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="py-4 px-16">{getTabContent()}</div>
      </div>

      {/* Fixed message button - only show when viewing someone else's profile */}
      {!isOwnProfile && (
        <div className="fixed bottom-4 right-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative group"
          >
            <motion.button
              className="p-3 bg-orange-600 text-white rounded-full shadow-lg"
              whileHover={{ boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
            >
              <MessageCircleMore />
            </motion.button>

            {/* Tooltip */}
            <motion.div
              className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                transformOrigin: "bottom right",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.1 }}
                className="group-hover:opacity-100"
              >
                Message tailor for more information
              </motion.div>
              <div className="absolute bottom-0 right-3 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TailorProfilePage;
