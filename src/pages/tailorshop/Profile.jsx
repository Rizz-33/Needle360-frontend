import { AnimatePresence, motion } from "framer-motion";
import { Edit2, MessageCircleMore, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaClock,
  FaMapMarkerAlt,
  FaPalette,
  FaStar,
  FaTag,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import { useAuthStore } from "../../store/Auth.store";
import { useAvailabilityStore } from "../../store/Availability.store";
import { useDesignStore } from "../../store/Design.store";
import { useOfferStore } from "../../store/Offer.store";
import { useServiceStore } from "../../store/Service.store";
import { useShopStore } from "../../store/Shop.store";
import { useUserInteractionStore } from "../../store/UserInteraction.store";

const TailorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tailor, fetchTailorById, isLoading } = useShopStore();
  const { user } = useAuthStore();
  const {
    followers,
    following,
    isFollowing,
    isLoading: isInteractionLoading,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkIfFollowing,
    resetState,
  } = useUserInteractionStore();

  // Use the design store
  const {
    designs,
    isLoading: isLoadingDesigns,
    fetchDesignsById,
  } = useDesignStore();

  // Use the offer store
  const {
    offers,
    isLoading: isLoadingOffers,
    fetchOffersByTailorId,
  } = useOfferStore();

  // Use the availability store
  const { availabilitySlots, fetchTailorAvailability } = useAvailabilityStore();

  // Use the service store
  const {
    services,
    isLoading: isLoadingServices,
    fetchServices,
    addServices,
    updateServices,
    deleteServices,
    getLocalServices,
  } = useServiceStore();

  const [activeTab, setActiveTab] = useState("designs");
  const [showAllBio, setShowAllBio] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef(null);

  const isOwnProfile = !id || (user && (user._id === id || user.id === id));
  const currentUserId = user?._id || user?.id;
  const tailorId = id || currentUserId;

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
  }, [id, navigate]);

  useEffect(() => {
    if (tailorId && tailorId !== "undefined") {
      fetchTailorById(tailorId);
      fetchTailorAvailability(tailorId);
      fetchServices(tailorId);
      resetState();
      getFollowers(tailorId);
      getFollowing(tailorId);

      if (!isOwnProfile && currentUserId) {
        checkIfFollowing(currentUserId, tailorId);
      }
    }

    return () => {
      resetState();
    };
  }, [fetchTailorById, tailorId, currentUserId, isOwnProfile]);

  // Fetch designs when the designs tab is active
  useEffect(() => {
    if (activeTab === "designs" && tailorId && tailorId !== "undefined") {
      fetchDesignsById(tailorId);
    }
  }, [activeTab, fetchDesignsById, tailorId]);

  // Fetch offers when the offers tab is active
  useEffect(() => {
    if (activeTab === "offers" && tailorId && tailorId !== "undefined") {
      fetchOffersByTailorId(tailorId);
    }
  }, [activeTab, fetchOffersByTailorId, tailorId]);

  const handleDesignClick = (design) => {
    setSelectedDesign(design);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!tailor) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>Tailor not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const avgRating =
    tailor.reviews && tailor.reviews.length > 0
      ? tailor.reviews.reduce(
          (acc, review) => acc + parseFloat(review.rating) || 0,
          0
        ) / tailor.reviews.length
      : 0;

  const formattedRating = avgRating.toFixed(1);

  const truncatedBio =
    tailor.bio && tailor.bio.length > 100 && !showAllBio
      ? tailor.bio.substring(0, 100) + "..."
      : tailor.bio;

  const goBack = () => {
    navigate(-1);
  };

  const handleFollow = async () => {
    if (!isOwnProfile && currentUserId) {
      try {
        if (isFollowing) {
          await unfollowUser(currentUserId, tailorId);
          toast.success("Unfollowed successfully");
        } else {
          await followUser(currentUserId, tailorId);
          toast.success("Now following");
        }
        getFollowers(tailorId);
      } catch (error) {
        toast.error(error.response?.data?.message || "Action failed");
      }
    }
  };

  const handleEditProfile = () => {
    navigate("/profile-setup");
  };

  const toggleBio = () => {
    setShowAllBio(!showAllBio);
  };

  const AvailabilityTabContent = () => {
    const today = new Date();
    const currentDayName = today.toLocaleString("en-us", { weekday: "long" });

    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const groupedSlots = availabilitySlots?.reduce((acc, slot) => {
      if (!acc[slot.day]) acc[slot.day] = [];
      acc[slot.day].push(slot);
      return acc;
    }, {});

    const formatTime = (timeStr) => {
      if (timeStr && timeStr.includes("1970-01-01T")) {
        const date = new Date(timeStr);
        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }
      }

      if (typeof timeStr === "string" && timeStr.includes(":")) {
        const [hours, minutes] = timeStr.split(":");
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }

      return "Invalid time";
    };

    return (
      <div className="space-y-6">
        <div className="flex overflow-x-auto pb-2 justify-center">
          {daysOfWeek.map((day) => {
            const daySlots = groupedSlots?.[day] || [];
            const isToday = day === currentDayName;
            const hasSlots =
              daySlots.length > 0 &&
              daySlots.some((slot) => slot.isOpen !== false);

            return (
              <div
                key={day}
                className={`flex-shrink-0 w-36 mr-8 last:mr-0 rounded-lg p-3 transition-all ${
                  isToday
                    ? "bg-blue-50 border-2 border-blue-200"
                    : hasSlots
                    ? "bg-gray-50 border border-gray-200"
                    : "bg-gray-50 border border-gray-200 opacity-70"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`font-medium ${
                      isToday ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {day.substring(0, 3)}
                  </span>
                  {isToday && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Today
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      hasSlots
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {hasSlots ? "Open" : "Closed"}
                  </span>
                </div>

                <div className="space-y-1 mt-3">
                  {hasSlots ? (
                    daySlots
                      .filter((slot) => slot.isOpen !== false)
                      .map((slot, idx) => (
                        <div
                          key={idx}
                          className={`px-2 py-1 rounded-md text-xs ${
                            slot.status === "available"
                              ? "bg-green-50 text-green-800 border border-green-100"
                              : "bg-yellow-50 text-yellow-800 border border-yellow-100"
                          }`}
                        >
                          {formatTime(slot.from)} - {formatTime(slot.to)}
                        </div>
                      ))
                  ) : (
                    <div className="text-xs text-gray-500 italic">
                      Not available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ProfileStats = () => (
    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
      <div className="flex items-center">
        <span className="font-semibold text-gray-900 mr-1">
          {followers?.length || 0}
        </span>{" "}
        followers
      </div>
      <div className="flex items-center">
        <span className="font-semibold text-gray-900 mr-1">
          {following?.length || 0}
        </span>{" "}
        following
      </div>
      <div className="flex items-center">
        <span className="font-semibold text-gray-900 mr-1">
          {designs?.length || 0}
        </span>{" "}
        designs
      </div>
      {avgRating > 0 && (
        <div className="flex items-center">
          <FaStar className="text-yellow-400 mr-1 text-xs" />
          <span className="font-semibold text-gray-900">{formattedRating}</span>
        </div>
      )}
    </div>
  );

  const ServicesSection = () => (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {services && services.length > 0 ? (
          services.map((service, index) => (
            <div
              key={index}
              className="px-3 py-1.5 bg-blue-50 text-primary rounded-full text-xs font-medium flex items-center gap-1"
            >
              <span>
                {typeof service === "object" ? service.title : service}
              </span>
            </div>
          ))
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );

  const ProfileTabs = () => (
    <div className="px-4 border-t sticky top-0 bg-white z-10">
      <div className="flex">
        {[
          { id: "designs", label: "Designs", icon: <FaPalette size={14} /> },
          { id: "offers", label: "Offers", icon: <FaTag size={14} /> },
          {
            id: "availability",
            label: "Availability",
            icon: <FaClock size={14} />,
          },
          { id: "reviews", label: "Reviews", icon: <FaStar size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex flex-col items-center ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const DesignGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
      {isLoadingDesigns ? (
        <div className="col-span-4 py-10 flex justify-center">
          <Loader />
        </div>
      ) : designs && designs.length > 0 ? (
        designs.map((design, index) => (
          <motion.div
            key={design.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="aspect-square bg-gray-100 relative overflow-hidden group cursor-pointer"
            onClick={() => handleDesignClick(design)}
          >
            {design.imageUrl ? (
              <img
                src={design.imageUrl}
                alt={design.title || design.itemName}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <FaPalette className="text-gray-400 text-xl" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
              <div className="text-white font-medium text-xs">
                <div>{design.title || design.itemName}</div>
                {design.price && (
                  <div className="mt-1 font-bold text-sm">
                    LKR {design.price}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="col-span-4 py-10 text-center text-gray-500 text-sm">
          <FaPalette className="text-2xl mx-auto mb-2 text-gray-300" />
          <p>No designs to display</p>
          {isOwnProfile && (
            <button
              onClick={() => navigate("/add-design")}
              className="mt-3 px-4 py-2 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary-dark transition-colors"
            >
              Add Your First Design
            </button>
          )}
        </div>
      )}
    </div>
  );

  const OffersList = () => (
    <div className="space-y-2">
      {isLoadingOffers ? (
        <div className="py-10 flex justify-center">
          <Loader />
        </div>
      ) : offers && offers.length > 0 ? (
        offers.map((offer, index) => {
          const isActive = offer.endDate
            ? new Date(offer.endDate) > new Date()
            : true;

          return (
            <motion.div
              key={offer._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg shadow-sm border ${
                isActive ? "border-primary/10" : "border-gray-200"
              }`}
            >
              <div className="flex">
                {offer.imageUrl && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden mr-2 flex-shrink-0">
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium mb-1 inline-block">
                      {isActive ? "Active" : "Expired"}
                    </span>
                    {offer.percentage > 0 && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                        {offer.percentage}% OFF
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {offer.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                    {offer.startDate && (
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-primary text-xs" />
                        <span>
                          {new Date(offer.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {offer.endDate && (
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-primary text-xs" />
                        <span>
                          {new Date(offer.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })
      ) : (
        <div className="py-10 text-center text-gray-500 text-sm">
          <FaTag className="text-2xl mx-auto mb-2 text-gray-300" />
          <p>No offers currently available</p>
          {isOwnProfile && (
            <button
              onClick={() => navigate("/add-offer")}
              className="mt-3 px-4 py-2 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary-dark transition-colors"
            >
              Create Special Offer
            </button>
          )}
        </div>
      )}
    </div>
  );

  const ReviewsList = () => (
    <div className="space-y-2">
      {tailor.reviews && tailor.reviews.length > 0 ? (
        tailor.reviews.map((review, index) => (
          <motion.div
            key={review.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800 text-sm">
                  {review.reviewer || review.clientName}
                </h3>
                <div className="flex text-yellow-400 mt-1">
                  {Array.from({
                    length: parseInt(review.rating) || 5,
                  }).map((_, i) => (
                    <FaStar key={i} className="text-xs" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString()
                  : "2 days ago"}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {review.comment || review.text}
            </p>
          </motion.div>
        ))
      ) : (
        <div className="py-10 text-center text-gray-500 text-sm">
          <FaStar className="text-2xl mx-auto mb-2 text-gray-300" />
          <p>No reviews yet</p>
          {!isOwnProfile && (
            <button
              onClick={() => navigate(`/leave-review/${tailorId}`)}
              className="mt-3 px-4 py-2 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary-dark transition-colors"
            >
              Leave a Review
            </button>
          )}
        </div>
      )}
    </div>
  );

  const getTabContent = () => {
    switch (activeTab) {
      case "designs":
        return <DesignGrid />;
      case "offers":
        return <OffersList />;
      case "availability":
        return <AvailabilityTabContent />;
      case "reviews":
        return <ReviewsList />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-16">
        {/* Cover image with back button */}
        <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
          <motion.button
            onClick={goBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 left-3 text-gray-800 bg-white/80 p-1.5 rounded-full shadow-sm hover:text-primary transition-colors duration-200"
          >
            <FaChevronLeft className="text-sm" />
          </motion.button>
        </div>

        {/* Profile section */}
        <div className="px-4 relative">
          {/* Profile image */}
          <div className="relative -mt-12 mb-3 flex justify-between">
            <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              {tailor.logoUrl ? (
                <img
                  src={tailor.logoUrl}
                  alt={tailor.shopName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-lg font-bold">
                  {tailor.shopName?.charAt(0)}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-end gap-2 pt-20">
              {isOwnProfile ? (
                <motion.button
                  onClick={handleEditProfile}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-white flex items-center gap-1 shadow-md hover:bg-primary-dark transition-colors"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </motion.button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    isFollowing
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      : "bg-primary text-white hover:bg-primary-dark"
                  } transition-colors shadow-md`}
                  disabled={isInteractionLoading}
                >
                  {isInteractionLoading
                    ? "Loading..."
                    : isFollowing
                    ? "Following"
                    : "Follow"}
                </button>
              )}
            </div>
          </div>

          {/* Profile info */}
          <div className="mb-4 -mt-10">
            <h1 className="text-xl font-bold text-gray-900">
              {tailor.shopName}
            </h1>

            <ProfileStats />

            {/* Bio */}
            {tailor.bio && (
              <div className="mt-2">
                <p className="text-xs text-gray-700">{truncatedBio}</p>
                {tailor.bio.length > 100 && (
                  <button
                    onClick={toggleBio}
                    className="text-primary text-xs font-medium mt-1 hover:underline"
                  >
                    {showAllBio ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}

            {/* Address */}
            {tailor.shopAddress && (
              <div className="mt-2 flex items-center text-xs text-gray-600">
                <FaMapMarkerAlt className="text-primary mr-1 text-xs" />
                <span>{tailor.shopAddress}</span>
              </div>
            )}
          </div>

          <ServicesSection />
        </div>

        <ProfileTabs />

        {/* Tab content */}
        <div className="py-3 px-4">{getTabContent()}</div>
      </div>

      {/* Fixed message button - only show when viewing someone else's profile */}
      {!isOwnProfile && (
        <div className="fixed bottom-4 right-4 z-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.button
              className="p-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
              onClick={() => navigate(`/chat/${tailorId}`)}
            >
              <MessageCircleMore size={20} />
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Design Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl overflow-hidden w-full max-w-md max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="relative p-3 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                    {tailor.logoUrl ? (
                      <img
                        src={tailor.logoUrl}
                        alt={tailor.shopName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                        {tailor.shopName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-xs">{tailor.shopName}</h3>
                    <p className="text-2xs text-gray-500">
                      {selectedDesign.category || "Fashion Design"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="text-gray-500" size={16} />
                </button>
              </div>

              {/* Modal content */}
              <div className="overflow-y-auto flex-1">
                {/* Design image */}
                <div className="w-full bg-gray-100 flex items-center justify-center p-4">
                  {selectedDesign.imageUrl ? (
                    <img
                      src={selectedDesign.imageUrl}
                      alt={selectedDesign.title || selectedDesign.itemName}
                      className="object-contain w-full h-full max-h-[300px] rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                      <FaPalette className="text-gray-400 text-3xl" />
                    </div>
                  )}
                </div>

                {/* Design details */}
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold">
                          {selectedDesign.title || selectedDesign.itemName}
                        </h2>
                        <p className="text-primary font-bold text-md mt-1">
                          LKR {selectedDesign.price}
                        </p>
                      </div>
                      {!isOwnProfile && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 bg-primary text-white rounded-full text-xs font-medium flex items-center gap-1"
                          onClick={() => {
                            closeModal();
                            navigate(`/chat/${tailorId}`);
                          }}
                        >
                          <MessageCircleMore size={12} />
                          <span>Message</span>
                        </motion.button>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">
                        Description
                      </h4>
                      <p className="text-xs text-gray-700">
                        {selectedDesign.description ||
                          "No description provided for this design."}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <h4 className="text-2xs font-medium text-gray-500 mb-0.5 uppercase tracking-wider">
                          Category
                        </h4>
                        <p className="text-xs text-gray-700">
                          {selectedDesign.category || "-"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-2xs font-medium text-gray-500 mb-0.5 uppercase tracking-wider">
                          Fabric Type
                        </h4>
                        <p className="text-xs text-gray-700">
                          {selectedDesign.fabricType || "-"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-2xs font-medium text-gray-500 mb-0.5 uppercase tracking-wider">
                          Colors
                        </h4>
                        <div className="flex gap-1.5 flex-wrap">
                          {selectedDesign.colors ? (
                            selectedDesign.colors
                              .split(",")
                              .map((color, i) => (
                                <div
                                  key={i}
                                  className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: color.trim() }}
                                  title={color.trim()}
                                />
                              ))
                          ) : (
                            <p className="text-xs text-gray-700">-</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-2xs font-medium text-gray-500 mb-0.5 uppercase tracking-wider">
                          Size
                        </h4>
                        <p className="text-xs text-gray-700">
                          {selectedDesign.size || "One Size"}
                        </p>
                      </div>
                    </div>

                    {/* Additional info */}
                    {selectedDesign.additionalInfo && (
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">
                          Additional Information
                        </h4>
                        <p className="text-xs text-gray-700">
                          {selectedDesign.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Modal footer - only for own profile */}
                  {isOwnProfile && (
                    <div className="mt-4 pt-3 border-t flex justify-end gap-1.5">
                      <button
                        onClick={() => {
                          closeModal();
                          navigate(`/edit-design/${selectedDesign.id}`);
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                      <button className="px-3 py-1.5 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary-dark transition-colors flex items-center gap-1">
                        <MessageCircleMore size={12} />
                        <span>Share</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TailorProfilePage;
