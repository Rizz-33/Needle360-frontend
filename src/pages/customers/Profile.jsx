import { AnimatePresence, motion } from "framer-motion";
import { Edit2, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaChevronLeft,
  FaEdit,
  FaEnvelope,
  FaPalette,
  FaPhone,
  FaRegStar,
  FaShoppingCart,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ChatPopup from "../../components/chat/ChatPopUp";
import MessageButton from "../../components/chat/MessageButton";
import { CustomButton } from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { useAuthStore } from "../../store/Auth.store";
import { useCustomerStore } from "../../store/Customer.store";
import { useDesignStore } from "../../store/Design.store";
import { useOrderStore } from "../../store/Order.store";
import { useReviewStore } from "../../store/Review.store";
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

const ReviewItem = ({ review, reviewersData }) => {
  const reviewer = reviewersData[review.clientId] || {
    name: "Anonymous User",
    profileImage: null,
    type: null,
  };

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

const OrderItem = ({ order }) => {
  const navigate = useNavigate();
  const statusStyles = {
    requested: "bg-purple-100 text-purple-800",
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const paymentStatusStyles = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    cod: "bg-orange-100 text-orange-800",
  };

  return (
    <div className="border-b border-gray-200 py-4 last:border-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-primary">Order #{order._id}</h4>
          <p className="text-xs text-gray-600 mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
          <p className="text-sm text-gray-600">
            Total: LKR {order.totalAmount?.toFixed(2) || "N/A"}
          </p>
          <p className="text-sm text-gray-600">Type: {order.orderType}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              statusStyles[order.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              paymentStatusStyles[order.paymentStatus] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            Payment:{" "}
            {order.paymentStatus === "cod"
              ? "Cash on Delivery"
              : order.paymentStatus.charAt(0).toUpperCase() +
                order.paymentStatus.slice(1)}
          </span>
          {order.status === "completed" &&
            order.paymentStatus === "pending" && (
              <CustomButton
                onClick={() => navigate(`/checkout/${order._id}`)}
                text="Checkout"
                color="primary"
                hover_color="hoverAccent"
                variant="filled"
                width="w-24"
                height="h-8"
                text_size="text-xs"
              />
            )}
        </div>
      </div>
    </div>
  );
};

const CreateOrderForm = ({ tailorId, onClose }) => {
  const { createOrder, isLoading } = useOrderStore();
  const [formData, setFormData] = useState({
    tailorId,
    customerContact: "",
    orderType: "",
    dueDate: "",
    totalAmount: "",
    notes: "",
    measurements: {},
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMeasurementChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      measurements: { ...prev.measurements, [key]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await createOrder(formData);
      toast.success("Order created successfully!");
      onClose();
    } catch (err) {
      setError(err.message || "Error creating order");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-lg font-bold text-gray-800">Create Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Contact Number
            </label>
            <input
              type="text"
              name="customerContact"
              value={formData.customerContact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Order Type
            </label>
            <select
              name="orderType"
              value={formData.orderType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select Order Type</option>
              {[
                "School Uniforms",
                "Saree Blouses",
                "Wedding Attire",
                "Office Wear",
                "National Dress",
                "Formal Wear",
                "Casual Wear",
                "Kidswear",
                "Religious/Cultural Outfits",
                "Custom Fashion Designs",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Total Amount (LKR)
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
              rows="4"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Measurements (e.g., Chest, Waist)
            </label>
            {["Chest", "Waist", "Hips", "Length"].map((key) => (
              <div key={key} className="flex items-center space-x-2 mb-2">
                <label className="text-sm text-gray-600 w-24">{key}</label>
                <input
                  type="text"
                  value={formData.measurements[key] || ""}
                  onChange={(e) => handleMeasurementChange(key, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={`Enter ${key} measurement`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3">
            <CustomButton
              onClick={onClose}
              text="Cancel"
              color="primary"
              hover_color="hoverAccent"
              variant="outlined"
              width="w-1/3"
              height="h-9"
            />
            <CustomButton
              type="submit"
              text={isLoading ? "Creating..." : "Create Order"}
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-1/3"
              height="h-9"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
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
  const {
    customerDesigns: designs,
    isLoading: isLoadingDesigns,
    fetchCustomerDesignsById,
  } = useDesignStore();
  const {
    reviews,
    isLoading: isLoadingReviews,
    fetchUserReviews,
    createReview,
  } = useReviewStore();
  const {
    orders,
    isLoading: isLoadingOrders,
    getCustomerOrdersById,
    initializeSocket,
    disconnectSocket,
  } = useOrderStore();
  const { fetchTailorById } = useShopStore();

  const [activeTab, setActiveTab] = useState("designs");
  const [showAllBio, setShowAllBio] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewersData, setReviewersData] = useState({});
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const loadingReviewerIdsRef = useRef(new Set());

  const currentUserId = currentUser?._id || currentUser?.id;
  const profileUserId = id;
  const isOwnProfile =
    !id ||
    (currentUserId &&
      profileUserId &&
      String(currentUserId) === String(profileUserId));

  useEffect(() => {
    if (currentUserId) {
      initializeSocket(currentUserId, currentUser.role);
    }
    return () => {
      disconnectSocket();
    };
  }, [currentUserId, currentUser?.role, initializeSocket, disconnectSocket]);

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
        console.error("Error fetching reviewer details:", error);
      } finally {
        loadingReviewerIdsRef.current.delete(reviewClientId);
      }
    },
    [reviewersData, fetchTailorById]
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
      fetchUserReviews(profileUserId);
      if (!isOwnProfile && currentUserId) {
        checkIfFollowing(currentUserId, profileUserId);
      }
      if (isOwnProfile) {
        getCustomerOrdersById({ page: 1, limit: 10 });
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
    getCustomerOrdersById,
  ]);

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
    fetchCreatorDetails();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRating(0);
    setReview("");
    document.body.style.overflow = "auto";
  };

  const fetchCreatorDetails = async () => {
    setIsLoadingCreator(true);
    try {
      if (selectedDesign?.customerId) {
        const response = await useCustomerStore
          .getState()
          .fetchCustomerById(selectedDesign.customerId);
        setCreatorDetails(response);
      }
    } catch (error) {
      console.error("Error fetching creator details:", error);
      toast.error("Failed to load creator details");
    } finally {
      setIsLoadingCreator(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error("Please provide a rating");
      return;
    }

    try {
      const currentUserId = currentUser?.id || currentUser?._id;

      if (!currentUserId) {
        toast.error("You must be logged in to submit a review");
        return;
      }

      const revieweeId = selectedDesign?.customerId;

      if (!revieweeId) {
        toast.error("Cannot determine who to review");
        return;
      }

      if (currentUserId === revieweeId) {
        toast.error("You cannot review your own design");
        return;
      }

      const reviewData = {
        clientId: currentUserId,
        rating: rating,
        comment: review,
        date: new Date(),
      };

      await createReview(revieweeId, reviewData);
      fetchUserReviews(revieweeId);
      toast.success("Thank you for your review!");
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const formatPrice = (price) => {
    if (price && typeof price === "number") {
      return `LKR ${price.toFixed(2)}`;
    } else if (price) {
      return `LKR ${price}`;
    }
    return "Not For Sale";
  };

  const isEdited =
    selectedDesign?.createdAt &&
    selectedDesign?.updatedAt &&
    new Date(selectedDesign.createdAt).getTime() !==
      new Date(selectedDesign.updatedAt).getTime();

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

  const ProfileTabs = () => {
    const tabs = [
      { id: "designs", label: "Designs", icon: <FaPalette size={14} /> },
      { id: "reviews", label: "Reviews", icon: <FaStar size={14} /> },
    ];

    if (isOwnProfile) {
      tabs.push({
        id: "orders",
        label: "Orders",
        icon: <FaShoppingCart size={14} />,
      });
    }

    return (
      <div className="px-4 border-t sticky top-0 bg-white z-10">
        <div className="flex">
          {tabs.map((tab) => (
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
  };

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
          reviews.map((review, index) => (
            <ReviewItem
              key={review._id || index}
              review={review}
              reviewersData={reviewersData}
            />
          ))
        ) : (
          <div className="py-10 text-center text-gray-500 text-sm">
            <FaStar className="text-2xl mx-auto mb-2 text-gray-300" />
            <p>No reviews yet</p>
            {!isOwnProfile && (
              <button
                onClick={() => navigate(`/leave-review/${profileUserId}`)}
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

  const OrdersList = () => {
    return (
      <div className="space-y-2">
        {isOwnProfile ? (
          <>
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
              <p className="font-medium">Your Orders</p>
              <p className="text-xs text-gray-500">
                View the status of your orders. Pay for completed orders to
                finalize your purchase.
              </p>
            </div>
            <div className="content-center justify-center">
              {isLoadingOrders ? (
                <div className="py-10 flex justify-center">
                  <Loader />
                </div>
              ) : orders && orders.length > 0 ? (
                orders.map((order, index) => (
                  <OrderItem key={order._id || index} order={order} />
                ))
              ) : (
                <div className="py-10 text-center text-gray-500 text-sm">
                  <FaShoppingCart className="text-2xl mx-auto mb-2 text-gray-300" />
                  <p>No orders placed yet</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-10 text-center text-gray-500 text-sm">
            <p>Orders are only visible to the profile owner.</p>
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
      case "orders":
        return isOwnProfile ? <OrdersList /> : null;
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
                <>
                  <button
                    onClick={() => setIsOrderFormOpen(true)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shadow-md"
                  >
                    Place Order
                  </button>
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
                </>
              )}
            </div>
          </div>

          <div className="mb-4 -mt-10">
            <h1 className="text-xl font-bold text-gray-900">{customer.name}</h1>
            <ProfileStats />
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
        <div className="py-3 px-4">{getTabContent()}</div>
      </div>

      {!isOwnProfile && (
        <div className="fixed bottom-4 right-4 z-20">
          <MessageButton userId={profileUserId} />
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
                  {selectedDesign.title ||
                    selectedDesign.itemName ||
                    "Untitled Design"}
                </h2>
                <h3 className="text-lg text-primary font-bold">
                  {selectedDesign.price
                    ? formatPrice(selectedDesign.price)
                    : ""}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={
                      selectedDesign.imageUrl ||
                      "/assets/placeholder-design.jpg"
                    }
                    alt={selectedDesign.title || selectedDesign.itemName}
                    className="w-full h-auto max-h-[400px] object-contain"
                    onError={(e) => {
                      e.target.src = "/assets/placeholder-design.jpg";
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="flex items-center justify-end space-x-3">
                  <div className="flex items-center text-gray-500 text-xs">
                    <span>
                      {selectedDesign?.createdAt &&
                        `created on ${formatDate(selectedDesign.createdAt)}`}
                      {selectedDesign?.updatedAt &&
                        selectedDesign?.updatedAt !==
                          selectedDesign?.createdAt &&
                        `edited on ${formatDate(selectedDesign.updatedAt)}`}
                    </span>
                  </div>
                  {isEdited && (
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
                  {isLoadingCreator ? (
                    <div className="flex justify-center py-4">
                      <Loader size="small" />
                    </div>
                  ) : creatorDetails ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        <img
                          src={
                            creatorDetails.profilePic ||
                            "/assets/placeholder-user.jpg"
                          }
                          alt={creatorDetails.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">
                          {creatorDetails.name || "Customer"}
                        </h4>
                        <div className="flex space-x-4 mt-1">
                          <a
                            href={`tel:${creatorDetails.contactNumber}`}
                            className="flex items-center text-xs text-primary hover:text-primary-dark"
                          >
                            <FaPhone className="mr-1" />
                            Call
                          </a>
                          <a
                            href={`mailto:${creatorDetails.email}`}
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
                        <ReviewItem
                          key={index}
                          review={review}
                          reviewersData={reviewersData}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm py-2">
                      No reviews yet. Be the first to review!
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    Rate this Design
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <textarea
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows="3"
                      placeholder="Share your thoughts about this designer..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                    <CustomButton
                      text="Submit Review"
                      color="primary"
                      hover_color="hoverPrimary"
                      variant="outlined"
                      onClick={handleSubmitReview}
                      width="w-1/3"
                      height="h-10"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {isOrderFormOpen && (
          <CreateOrderForm
            tailorId={profileUserId}
            onClose={() => setIsOrderFormOpen(false)}
          />
        )}
      </AnimatePresence>

      <ChatPopup />
    </div>
  );
};

export default CustomerProfilePage;
