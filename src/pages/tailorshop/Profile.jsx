import { AnimatePresence, motion } from "framer-motion";
import { Edit2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPalette,
  FaPhone,
  FaRegStar,
  FaStar,
  FaTag,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ChatPopup from "../../components/chat/ChatPopup";
import MessageButton from "../../components/chat/MessageButton";
import { CustomButton } from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { predefinedServices } from "../../configs/Services.configs";
import { roleTypeNumbers } from "../../configs/User.config";
import { useAuthStore } from "../../store/Auth.store";
import { useAvailabilityStore } from "../../store/Availability.store";
import { useCustomerStore } from "../../store/Customer.store";
import { useDesignStore } from "../../store/Design.store";
import { useOfferStore } from "../../store/Offer.store";
import { useOrderStore } from "../../store/Order.store";
import { useReviewStore } from "../../store/Review.store";
import { useServiceStore } from "../../store/Service.store";
import { useShopStore } from "../../store/Shop.store";
import { useUserInteractionStore } from "../../store/UserInteraction.store";

const formatDate = (dateString) => {
  if (!dateString) return "Date not available";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

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

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="focus:outline-none"
        >
          {star <= rating ? (
            <FaStar className="text-yellow-400 text-lg" />
          ) : (
            <FaRegStar className="text-yellow-400 text-lg" />
          )}
        </button>
      ))}
    </div>
  );
};

const ImageSlider = ({ images, placeholderImg }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 1));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-h-[400px]">
        <img
          src={images[currentImageIndex] || placeholderImg}
          alt={`Image ${currentImageIndex + 1}`}
          className="w-full h-auto max-h-[400px] object-contain rounded-lg"
          onError={(e) => {
            e.target.src = placeholderImg;
            e.target.onerror = null;
          }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={handlePreviousImage}
              disabled={currentImageIndex === 0}
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full ${
                currentImageIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-black/70"
              }`}
              aria-label="Previous image"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              disabled={currentImageIndex === images.length - 1}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full ${
                currentImageIndex === images.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-black/70"
              }`}
              aria-label="Next image"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {images.length > 0
          ? currentImageIndex === 0
            ? "Final Product"
            : `Detail Image ${currentImageIndex}`
          : "No Images Available"}
      </p>
    </div>
  );
};

const ReviewItem = ({ review }) => {
  const [reviewer, setReviewer] = useState({
    name: "Anonymous User",
    profileImage: null,
    type: null,
  });

  useEffect(() => {
    const fetchReviewer = async () => {
      if (review.clientId) {
        try {
          try {
            const customer = await useCustomerStore
              .getState()
              .fetchCustomerById(review.clientId);
            if (customer && customer.name) {
              setReviewer({
                name: customer.name,
                profileImage: customer.profilePic,
                type: "customer",
              });
              return;
            }
          } catch (error) {}

          try {
            const tailor = await useShopStore
              .getState()
              .fetchTailorById(review.clientId);
            if (tailor) {
              setReviewer({
                name: tailor.shopName || tailor.name,
                profileImage: tailor.logoUrl,
                type: "tailor",
              });
              return;
            }
          } catch (error) {
            console.error("Error fetching tailor reviewer details:", error);
          }
        } catch (error) {
          console.error("Error fetching reviewer details:", error);
        }
      }
    };

    fetchReviewer();
  }, [review.clientId]);

  return (
    <div className="border-b border-gray-200 py-4 last:border-0">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="mr-3 w-10 h-10 rounded-full overflow-hidden">
            {reviewer.profileImage ? (
              <img
                src={reviewer.profileImage}
                alt={reviewer.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/placeholder-user.jpg";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-800">
              {reviewer.name}
              {reviewer.type && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {reviewer.type === "tailor" ? "Tailor" : "Customer"}
                </span>
              )}
            </h4>
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
        <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
      )}
    </div>
  );
};

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
  const {
    tailorDesigns: designs,
    isLoading: isLoadingDesigns,
    fetchTailorDesignsById,
  } = useDesignStore();
  const {
    offers,
    isLoading: isLoadingOffers,
    fetchOffersByTailorId,
  } = useOfferStore();
  const { availabilitySlots, fetchTailorAvailability } = useAvailabilityStore();
  const { services, fetchServices } = useServiceStore();
  const {
    reviews,
    isLoading: isLoadingReviews,
    fetchUserReviews,
    createReview,
  } = useReviewStore();
  const { fetchCustomerById } = useCustomerStore();
  const { createOrder } = useOrderStore();

  const [activeTab, setActiveTab] = useState("designs");
  const [showAllBio, setShowAllBio] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [reviewersData, setReviewersData] = useState({});
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderForm, setOrderForm] = useState({
    orderType: "",
    totalAmount: "",
    dueDate: "",
    customerContact: "",
    notes: "",
  });

  const currentUserId = user?._id || user?.id;
  const tailorId = id || currentUserId;
  const isOwnProfile = !id || (user && (user._id === id || user.id === id));
  const loadingReviewerIdsRef = useRef(new Set());
  const placeholderImg = "/assets/placeholder-design.jpg";

  const loadReviewerDetails = useCallback(
    async (reviewClientId) => {
      if (
        reviewersData[reviewClientId] ||
        loadingReviewerIdsRef.current.has(reviewClientId)
      ) {
        return;
      }

      loadingReviewerIdsRef.current.add(reviewClientId);

      try {
        try {
          const customer = await fetchCustomerById(reviewClientId);
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
        } catch (error) {}

        try {
          const tailor = await useShopStore
            .getState()
            .fetchTailorById(reviewClientId);
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
      } catch (error) {
        console.error("Error fetching reviewer details:", error);
      } finally {
        loadingReviewerIdsRef.current.delete(reviewClientId);
      }
    },
    [reviewersData]
  );

  useEffect(() => {
    if (!reviews || reviews.length === 0) return;

    const reviewersToLoad = reviews
      .filter((review) => review.clientId)
      .filter(
        (review) =>
          !reviewersData[review.clientId] &&
          !loadingReviewerIdsRef.current.has(review.clientId)
      )
      .map((review) => review.clientId);

    reviewersToLoad.forEach((clientId) => {
      loadReviewerDetails(clientId);
    });
  }, [reviews, loadReviewerDetails]);

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
      fetchUserReviews(tailorId);

      if (!isOwnProfile && currentUserId) {
        checkIfFollowing(currentUserId, tailorId);
      }
    }

    return () => {
      resetState();
    };
  }, [fetchTailorById, tailorId, currentUserId, isOwnProfile]);

  useEffect(() => {
    if (activeTab === "designs" && tailorId && tailorId !== "undefined") {
      fetchTailorDesignsById(tailorId);
    }
  }, [activeTab, fetchTailorDesignsById, tailorId]);

  useEffect(() => {
    if (activeTab === "offers" && tailorId && tailorId !== "undefined") {
      fetchOffersByTailorId(tailorId);
    }
  }, [activeTab, fetchOffersByTailorId, tailorId]);

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
    setRating(0);
    setReviewComment("");
    document.body.style.overflow = "auto";
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setOrderForm({
      orderType: "",
      totalAmount: "",
      dueDate: "",
      customerContact: "",
      notes: "",
    });
  };

  const handleCreateOrderClick = () => {
    if (!user) {
      toast.error("Please log in to create an order");
      return;
    }
    if (user.role !== roleTypeNumbers.customer) {
      toast.error("Only customers can create orders");
      return;
    }
    if (isOwnProfile) {
      toast.error("You cannot create an order for your own design");
      return;
    }
    setOrderForm({
      orderType:
        selectedDesign.tags?.[0] ||
        predefinedServices[0] ||
        "Custom Fashion Designs",
      totalAmount: selectedDesign.price ? selectedDesign.price.toString() : "",
      dueDate: "",
      customerContact: user.phoneNumber || "",
      notes: `Order for design: ${selectedDesign.title || "Untitled Design"}`,
    });
    setIsOrderModalOpen(true);
  };

  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (!orderForm.orderType) {
        toast.error("Please select an order type");
        return;
      }
      if (!orderForm.totalAmount || parseFloat(orderForm.totalAmount) <= 0) {
        toast.error("Total amount must be a positive number");
        return;
      }
      if (!orderForm.dueDate) {
        toast.error("Please select a due date");
        return;
      }
      if (!orderForm.customerContact) {
        toast.error("Please provide a contact number");
        return;
      }
      if (
        !selectedDesign.tailorId ||
        typeof selectedDesign.tailorId !== "string"
      ) {
        console.error("Invalid tailorId:", selectedDesign.tailorId);
        toast.error("Invalid tailor ID");
        return;
      }

      const orderData = {
        tailorId: selectedDesign.tailorId,
        orderType: orderForm.orderType,
        totalAmount: parseFloat(orderForm.totalAmount),
        dueDate: new Date(orderForm.dueDate).toISOString(),
        customerContact: orderForm.customerContact,
        notes: orderForm.notes,
      };

      await createOrder(orderData, selectedDesign.tailorId);
      toast.success("Order created successfully!");
      closeOrderModal();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
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
            key={design._id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="aspect-square bg-gray-100 relative overflow-hidden group cursor-pointer"
            onClick={() => handleDesignClick(design)}
          >
            {design.imageURLs?.[0] || design.imageUrl ? (
              <img
                src={design.imageURLs?.[0] || design.imageUrl}
                alt={design.title || "Tailor Design"}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = placeholderImg;
                  e.target.onerror = null;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <FaPalette className="text-gray-400 text-xl" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
              <div className="text-white font-medium text-xs">
                <div>{design.title || "Untitled Design"}</div>
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

  const ReviewsList = () => {
    return (
      <div className="space-y-2">
        {isLoadingReviews ? (
          <div className="py-10 flex justify-center">
            <Loader />
          </div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <motion.div
              key={review._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"
            >
              <ReviewItem review={review} />
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
                Leave a Review About the Designer
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
      <div className="flex-1 overflow-y-auto pb-16">
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

        <div className="px-4 relative">
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

            <div className="flex items-end gap-2 pt-20">
              {isOwnProfile ? (
                <CustomButton
                  text="Go to Dashboard"
                  color="primary"
                  hover_color="hoverPrimary"
                  variant="outlined"
                  onClick={() => navigate("/tailor-dashboard")}
                  height="h-8"
                  width="w-32"
                />
              ) : (
                ""
              )}
            </div>

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

          <div className="mb-4 -mt-10">
            <h1 className="text-xl font-bold text-gray-900">
              {tailor.shopName}
            </h1>

            <ProfileStats />

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

        <div className="py-3 px-4">{getTabContent()}</div>
      </div>

      {!isOwnProfile && (
        <div className="fixed bottom-4 right-4 z-20">
          <MessageButton userId={tailorId} />
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedDesign.title || "Untitled Design"}
                </h2>
                <h3 className="text-lg text-primary font-bold">
                  {selectedDesign.price ? `LKR ${selectedDesign.price}` : ""}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="rounded-xl overflow-hidden bg-gray-100">
                  <ImageSlider
                    images={
                      selectedDesign.imageURLs?.length > 0
                        ? selectedDesign.imageURLs
                        : selectedDesign.imageUrl
                        ? [selectedDesign.imageUrl]
                        : []
                    }
                    placeholderImg={placeholderImg}
                  />
                </div>
                <div className="flex items-center justify-end space-x-3">
                  <div className="flex items-center text-gray-500 text-xs">
                    <span>
                      {selectedDesign.createdAt &&
                        `created on ${formatDate(selectedDesign.createdAt)}`}
                      {selectedDesign.updatedAt &&
                        selectedDesign.updatedAt !== selectedDesign.createdAt &&
                        `edited on ${formatDate(selectedDesign.updatedAt)}`}
                    </span>
                  </div>
                  {selectedDesign.createdAt &&
                    selectedDesign.updatedAt &&
                    new Date(selectedDesign.createdAt).getTime() !==
                      new Date(selectedDesign.updatedAt).getTime() && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FaEdit className="mr-1" />
                        Edited
                      </span>
                    )}
                </div>
                <div className="border-b border-primary/10 pb-4">
                  <p className="text-gray-600 text-sm">
                    {selectedDesign.description || "No description available"}
                  </p>
                  {selectedDesign.tags && selectedDesign.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedDesign.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-b border-primary/10 pb-4">
                  <h3 className="text-xs text-gray-900 mb-3">Designed by</h3>
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader size="small" />
                    </div>
                  ) : tailor ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        <img
                          src={tailor.logoUrl || "/assets/placeholder-user.jpg"}
                          alt={tailor.shopName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">
                          {tailor.shopName || "Tailor Shop"}
                        </h4>
                        <div className="flex space-x-4 mt-1">
                          <a
                            href={`tel:${tailor.contactNumber}`}
                            className="flex items-center text-xs text-primary hover:text-primary-dark"
                          >
                            <FaPhone className="mr-1" />
                            Call
                          </a>
                          <a
                            href={`mailto:${tailor.email}`}
                            className="flex items-center text-xs text-primary hover:text-primary-dark"
                          >
                            <FaEnvelope className="mr-1" />
                            Email
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      Creator details not available
                    </div>
                  )}
                </div>
                <div className="border-b border-primary/10 pb-4">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    Designer Reviews
                  </h3>
                  {isLoadingReviews ? (
                    <div className="flex justify-center py-4">
                      <Loader size="small" />
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review, index) => (
                        <ReviewItem key={index} review={review} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm py-2">
                      No reviews yet. Be the first to review!
                    </div>
                  )}
                </div>
                {!isOwnProfile && user ? (
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-3">
                      Rate this Tailor
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <StarRating rating={rating} setRating={setRating} />
                      </div>
                      <textarea
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows="3"
                        placeholder="Share your thoughts about this tailor..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                      <CustomButton
                        text="Submit Review"
                        color="primary"
                        hover_color="hoverPrimary"
                        variant="outlined"
                        onClick={async () => {
                          if (!rating) {
                            toast.error("Please provide a rating");
                            return;
                          }
                          try {
                            const reviewData = {
                              clientId: currentUserId,
                              rating: rating,
                              comment: reviewComment,
                              date: new Date(),
                            };
                            await createReview(tailorId, reviewData);
                            toast.success("Thank you for your review!");
                            setRating(0);
                            setReviewComment("");
                            fetchUserReviews(tailorId);
                          } catch (error) {
                            console.error("Error submitting review:", error);
                            toast.error("Failed to submit review");
                          }
                        }}
                        width="w-1/3"
                        height="h-10"
                      />
                    </div>
                  </div>
                ) : isOwnProfile ? (
                  <div className="text-center text-xs text-gray-500 italic py-2">
                    This is your profile. You cannot leave a review on your own
                    work.
                  </div>
                ) : (
                  <div className="text-center text-gray-500 italic py-2">
                    Please log in to leave a review.
                  </div>
                )}
                <div className="mt-6 pt-3 border-t flex justify-end gap-1.5">
                  {isOwnProfile ? (
                    <CustomButton
                      text="Edit"
                      color="primary"
                      hover_color="hoverAccent"
                      variant="filled"
                      width="w-1/3"
                      height="h-8"
                      onClick={() => {
                        closeModal();
                        handleEditProfile();
                      }}
                    />
                  ) : (
                    user &&
                    user.role === roleTypeNumbers.customer &&
                    selectedDesign.tailorId && (
                      <CustomButton
                        text="Get This Tailored"
                        color="primary"
                        hover_color="hoverAccent"
                        variant="filled"
                        width="w-1/3"
                        height="h-8"
                        onClick={handleCreateOrderClick}
                      />
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOrderModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeOrderModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  Create Order
                </h2>
                <button
                  onClick={closeOrderModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Order Type
                  </label>
                  <select
                    name="orderType"
                    value={orderForm.orderType}
                    onChange={handleOrderFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Select order type</option>
                    {predefinedServices.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Total Amount (LKR) (amount will vary)
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={orderForm.totalAmount}
                    onChange={handleOrderFormChange}
                    placeholder="Enter total amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={orderForm.dueDate}
                    onChange={handleOrderFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Customer Contact
                  </label>
                  <input
                    type="text"
                    name="customerContact"
                    value={orderForm.customerContact}
                    onChange={handleOrderFormChange}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={orderForm.notes}
                    onChange={handleOrderFormChange}
                    placeholder="Enter any additional notes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    rows="4"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <CustomButton
                    text="Cancel"
                    color="primary"
                    hover_color="hoverAccent"
                    variant="outlined"
                    width="w-1/3"
                    height="h-10"
                    onClick={closeOrderModal}
                  />
                  <CustomButton
                    text={isSubmitting ? "Submitting" : "Submit Order"}
                    color="primary"
                    hover_color="hoverAccent"
                    variant="filled"
                    width="w-1/3"
                    height="h-10"
                    onClick={handleOrderSubmit}
                    disabled={isSubmitting}
                  />
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

export default TailorProfilePage;
