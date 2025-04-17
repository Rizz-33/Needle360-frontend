import { AnimatePresence, motion } from "framer-motion";
import { Edit2, MessageCircleMore, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaChevronLeft,
  FaPalette,
  FaRegStar,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ChatPopup from "../../components/chat/ChatPopUp";
import MessageButton from "../../components/chat/MessageButton";
import Loader from "../../components/ui/Loader";
import { useAuthStore } from "../../store/Auth.store";
import { useCustomerStore } from "../../store/Customer.store";
import { useDesignStore } from "../../store/Design.store";
import { useReviewStore } from "../../store/Review.store";
import { useShopStore } from "../../store/Shop.store";
import { useUserInteractionStore } from "../../store/UserInteraction.store";

const formatDate = (dateString) => {
  if (!dateString) return "Date not available";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Add ordinal suffix to day
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month}, ${year}`;
};

const CustomerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customer, fetchCustomerById, isLoading } = useCustomerStore();
  const { user: currentUser } = useAuthStore();
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
    customerDesigns: designs,
    isLoading: isLoadingDesigns,
    fetchCustomerDesignsById,
  } = useDesignStore();

  // Use the review store
  const {
    reviews,
    isLoading: isLoadingReviews,
    fetchUserReviews,
  } = useReviewStore();

  // Use shop store to fetch reviewer details
  const { fetchTailorById } = useShopStore();

  const [activeTab, setActiveTab] = useState("designs");
  const [showAllBio, setShowAllBio] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewersData, setReviewersData] = useState({});
  const loadingReviewerIdsRef = useRef(new Set());

  // Fix for isOwnProfile - Normalize IDs for comparison
  const currentUserId = currentUser?._id || currentUser?.id;
  const profileUserId = id;

  // Improved logic for determining if viewing own profile
  const isOwnProfile =
    !id ||
    (currentUserId &&
      profileUserId &&
      String(currentUserId) === String(profileUserId));

  const loadReviewerDetails = useCallback(
    async (reviewClientId) => {
      // Skip if already loaded or loading
      if (
        reviewersData[reviewClientId] ||
        loadingReviewerIdsRef.current.has(reviewClientId)
      ) {
        return;
      }

      // Mark as loading
      loadingReviewerIdsRef.current.add(reviewClientId);

      // Try tailor
      try {
        const tailor = await fetchTailorById(reviewClientId);
        if (tailor) {
          setReviewersData((prev) => ({
            ...prev,
            [reviewClientId]: {
              name: tailor.shopName || tailor.name,
              profileImage: tailor.logoUrl,
              type: "tailor",
            },
          }));
          return;
        }
      } catch (error) {
        console.error("Error fetching tailor reviewer details:", error);
      }

      try {
        // First try customer
        try {
          const customer = await useCustomerStore
            .getState()
            .fetchCustomerById(reviewClientId);
          if (customer && customer.name) {
            setReviewersData((prev) => ({
              ...prev,
              [reviewClientId]: {
                name: customer.name,
                profileImage: customer.profilePic,
                type: "customer",
              },
            }));
            return;
          }
        } catch (error) {
          // Not a customer, continue to tailor
        }
      } catch (error) {
        console.error("Error fetching reviewer details:", error);
      } finally {
        // Remove from loading, whether successful or not
        loadingReviewerIdsRef.current.delete(reviewClientId);
      }
    },
    [reviewersData]
  );

  useEffect(() => {
    if (!id && !currentUserId) {
      navigate("/");
      return;
    }
  }, [id, navigate, currentUserId]);

  useEffect(() => {
    if (profileUserId && profileUserId !== "undefined") {
      fetchCustomerById(profileUserId);
      resetState();
      getFollowers(profileUserId);
      getFollowing(profileUserId);
      fetchUserReviews(profileUserId); // Fetch reviews when component mounts

      if (!isOwnProfile && currentUserId) {
        checkIfFollowing(currentUserId, profileUserId);
      }
    }

    return () => {
      resetState();
    };
  }, [
    fetchCustomerById,
    profileUserId,
    currentUserId,
    isOwnProfile,
    resetState,
    getFollowers,
    getFollowing,
    checkIfFollowing,
    fetchUserReviews,
  ]);

  // Fetch designs when the designs tab is active
  useEffect(() => {
    if (
      activeTab === "designs" &&
      profileUserId &&
      profileUserId !== "undefined"
    ) {
      fetchCustomerDesignsById(profileUserId);
    }
  }, [activeTab, fetchCustomerDesignsById, profileUserId]);

  useEffect(() => {
    // Only proceed if we have reviews
    if (!reviews || reviews.length === 0) return;

    // Find reviewers that need to be loaded
    const reviewersToLoad = reviews
      .filter((review) => review.clientId)
      .filter(
        (review) =>
          !reviewersData[review.clientId] &&
          !loadingReviewerIdsRef.current.has(review.clientId)
      )
      .map((review) => review.clientId);

    // Load each reviewer
    reviewersToLoad.forEach((clientId) => {
      loadReviewerDetails(clientId);
    });
  }, [reviews, loadReviewerDetails]);

  // Calculate average rating from the reviews in the store
  const avgRating =
    reviews.length > 0
      ? reviews.reduce(
          (acc, review) => acc + parseFloat(review.rating) || 0,
          0
        ) / reviews.length
      : 0;

  const formattedRating = avgRating.toFixed(1);

  const handleDesignClick = (design) => {
    setSelectedDesign(design);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleFollow = async () => {
    if (!isOwnProfile && currentUserId) {
      try {
        if (isFollowing) {
          await unfollowUser(currentUserId, profileUserId);
          toast.success("Unfollowed successfully");
        } else {
          await followUser(currentUserId, profileUserId);
          toast.success("Now following");
        }
        getFollowers(profileUserId);
      } catch (error) {
        toast.error(error.response?.data?.message || "Action failed");
      }
    }
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const toggleBio = () => {
    setShowAllBio(!showAllBio);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>User not found</p>
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

  const ProfileTabs = () => (
    <div className="px-4 border-t sticky top-0 bg-white z-10">
      <div className="flex">
        {[
          { id: "designs", label: "Designs", icon: <FaPalette size={14} /> },
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

  const ReviewsList = () => {
    return (
      <div className="space-y-2">
        {isLoadingReviews ? (
          <div className="py-10 flex justify-center">
            <Loader />
          </div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review, index) => {
            const reviewer = reviewersData[review.clientId] || {
              name: "Anonymous User",
              profileImage: null,
              type: null,
            };

            return (
              <motion.div
                key={review._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="mr-3 w-10 h-10 rounded-full overflow-hidden">
                      {reviewer.profileImage ? (
                        <img
                          src={reviewer.profileImage}
                          alt={reviewer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <FaUser className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">
                        {reviewer.name}
                        {reviewer.type && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {reviewer.type === "tailor" ? "Tailor" : "Customer"}
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>
                              {star <= review.rating ? (
                                <FaStar className="text-yellow-400 text-xs" />
                              ) : (
                                <FaRegStar className="text-yellow-400 text-xs" />
                              )}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {review.rating.toFixed(0)}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    {formatDate(review.createdAt || review.date)}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-xs text-gray-600 mt-2">{review.comment}</p>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="py-10 text-center text-gray-500 text-sm">
            <FaStar className="text-2xl mx-auto mb-2 text-gray-300" />
            <p>No reviews yet</p>
            {!isOwnProfile && (
              <button
                onClick={() => navigate(`/leave-review/${profileUserId}`)}
                className="mt-3 px-4 py-2 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary-dark transition-colors"
              >
                Leave a Review
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const getTabContent = () => {
    switch (activeTab) {
      case "designs":
        return <DesignGrid />;
      case "reviews":
        return <ReviewsList />;
      default:
        return null;
    }
  };

  const truncatedBio =
    customer.bio && customer.bio.length > 100 && !showAllBio
      ? customer.bio.substring(0, 100) + "..."
      : customer.bio;

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
              {customer.profilePic ? (
                <img
                  src={customer.profilePic}
                  alt={customer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-lg font-bold">
                  {customer.name?.charAt(0)}
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
            <h1 className="text-xl font-bold text-gray-900">{customer.name}</h1>

            <ProfileStats />

            {/* Bio */}
            {customer.bio && (
              <div className="mt-2">
                <p className="text-xs text-gray-700">{truncatedBio}</p>
                {customer.bio.length > 100 && (
                  <button
                    onClick={toggleBio}
                    className="text-primary text-xs font-medium mt-1 hover:underline"
                  >
                    {showAllBio ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <ProfileTabs />

        {/* Tab content */}
        <div className="py-3 px-4">{getTabContent()}</div>
      </div>

      {/* Fixed message button - only show when viewing someone else's profile */}
      {!isOwnProfile && (
        <div className="fixed bottom-4 right-4 z-20">
          <MessageButton userId={profileUserId} />
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
                    {customer.profilePic ? (
                      <img
                        src={customer.profilePic}
                        alt={customer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                        {customer.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-xs">{customer.name}</h3>
                    <p className="text-2xs text-gray-500">
                      {selectedDesign.category || "Design"}
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
                        {selectedDesign.price && (
                          <p className="text-primary font-bold text-md mt-1">
                            LKR {selectedDesign.price}
                          </p>
                        )}
                      </div>
                      {!isOwnProfile && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 bg-primary text-white rounded-full text-xs font-medium flex items-center gap-1"
                          onClick={() => {
                            closeModal();
                            navigate(`/chat/${profileUserId}`);
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

      <ChatPopup />
    </div>
  );
};

export default CustomerProfilePage;
