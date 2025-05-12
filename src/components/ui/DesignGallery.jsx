import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaRegStar,
  FaStar,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { predefinedServices } from "../../configs/Services.configs";
import { roleTypeNumbers } from "../../configs/User.config";
import { useAuthStore } from "../../store/Auth.store";
import { useCustomerStore } from "../../store/Customer.store";
import { useDesignStore } from "../../store/Design.store";
import { useOrderStore } from "../../store/Order.store";
import { useReviewStore } from "../../store/Review.store";
import { useShopStore } from "../../store/Shop.store";
import Loader from "../ui/Loader";
import { CustomButton } from "./Button";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="focus:outline-none p-1"
          aria-label={`Rate ${star} stars`}
        >
          {star <= rating ? (
            <FaStar className="text-yellow-400 text-sm sm:text-lg" />
          ) : (
            <FaRegStar className="text-yellow-400 text-sm sm:text-lg" />
          )}
        </button>
      ))}
    </div>
  );
};

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

  return `${day}${suffix} of ${month}, ${year}`;
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
        } catch (error) {
          console.log("Not a customer, trying tailor");
        }
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
      }
    };

    fetchReviewer();
  }, [review.clientId]);

  return (
    <div className="border-b border-gray-200 py-3 sm:py-4 last:border-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
        <div className="flex items-center">
          <div className="mr-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
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
                <FaUser className="text-gray-500 text-sm sm:text-base" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-800 text-sm sm:text-base">
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
                      <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    ) : (
                      <FaRegStar className="text-yellow-400 text-xs sm:text-sm" />
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
        <div className="flex items-center text-xs text-gray-500 mt-2 sm:mt-0">
          {formatDate(review.date)}
        </div>
      </div>
      {review.comment && (
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          {review.comment}
        </p>
      )}
    </div>
  );
};

const DesignCard = ({ design }) => {
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);
  const [designReviews, setDesignReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isOwnDesign, setIsOwnDesign] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [orderForm, setOrderForm] = useState({
    orderType: "",
    totalAmount: "",
    dueDate: "",
    customerContact: "",
    notes: "",
  });
  const { createReview, fetchUserReviews } = useReviewStore();
  const { createOrder } = useOrderStore();
  const { user } = useAuthStore();

  const images =
    design.imageURLs && design.imageURLs.length > 0
      ? design.imageURLs
      : design.imageUrl
      ? [design.imageUrl]
      : [];
  const placeholderImg = "/assets/placeholder-design.jpg";

  const handleViewDetails = () => {
    setShowModal(true);
    setCurrentImageIndex(0); // Reset to first image when opening modal
    fetchCreatorDetails();
    fetchDesignReviews();
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
    if (isOwnDesign) {
      toast.error("You cannot create an order for your own design");
      return;
    }
    setOrderForm({
      orderType:
        design.tags?.[0] || predefinedServices[0] || "Custom Fashion Designs",
      totalAmount: design.price ? design.price.toString() : "",
      dueDate: "",
      customerContact: user.phoneNumber || "",
      notes: `Order for design: ${design.title || "Untitled Design"}`,
    });
    setShowOrderModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRating(0);
    setReview("");
    setCurrentImageIndex(0);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setOrderForm({
      orderType: "",
      totalAmount: "",
      dueDate: "",
      customerContact: "",
      notes: "",
    });
  };

  const fetchCreatorDetails = async () => {
    setIsLoadingCreator(true);
    try {
      if (
        (design.userType === "tailor" ||
          design.role === roleTypeNumbers.tailor) &&
        design.tailorId
      ) {
        const response = await useShopStore
          .getState()
          .fetchTailorById(design.tailorId);
        setCreatorDetails(response);

        if (
          user &&
          (user.id === design.tailorId || user._id === design.tailorId)
        ) {
          setIsOwnDesign(true);
        }
      } else if (design.customerId) {
        const response = await useCustomerStore
          .getState()
          .fetchCustomerById(design.customerId);
        setCreatorDetails(response);

        if (
          user &&
          (user.id === design.customerId || user._id === design.customerId)
        ) {
          setIsOwnDesign(true);
        }
      }
    } catch (error) {
      console.error("Error fetching creator details:", error);
      toast.error("Failed to load creator details");
    } finally {
      setIsLoadingCreator(false);
    }
  };

  const fetchDesignReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const userId = design.tailorId || design.customerId;

      if (userId) {
        const response = await fetchUserReviews(userId);
        const relevantReviews = response.reviews || [];
        setDesignReviews(relevantReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.warning("Please provide a rating");
      return;
    }

    try {
      const currentUserId = user?.id || user?._id;

      if (!currentUserId) {
        toast.error("You must be logged in to submit a review");
        return;
      }

      const revieweeId = design.tailorId || design.customerId;

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
      fetchDesignReviews();
      toast.success("Thank you for your review!");
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
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
      if (!design.tailorId || typeof design.tailorId !== "string") {
        console.error("Invalid tailorId:", design.tailorId);
        toast.error("Invalid tailor ID");
        return;
      }

      const orderData = {
        tailorId: design.tailorId,
        orderType: orderForm.orderType,
        totalAmount: parseFloat(orderForm.totalAmount),
        dueDate: new Date(orderForm.dueDate).toISOString(),
        customerContact: orderForm.customerContact,
        notes: orderForm.notes,
      };

      await createOrder(orderData, design.tailorId);
      toast.success("Order created successfully!");
      closeOrderModal();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
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
    design.createdAt &&
    design.updatedAt &&
    new Date(design.createdAt).getTime() !==
      new Date(design.updatedAt).getTime();

  const averageRating = design.averageRating || 0;
  const reviewCount = design.reviewCount || 0;

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 1));
  };

  return (
    <>
      <div className="w-full sm:max-w-sm rounded-xl overflow-hidden shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 ease-in-out p-3 sm:p-4 border border-gray-100 hover:shadow-xl">
        <div className="relative">
          <img
            className="w-full h-48 sm:h-64 object-cover rounded-lg"
            src={design.imageUrl || placeholderImg}
            alt={design.title}
            onError={(e) => {
              e.target.src = placeholderImg;
              e.target.onerror = null;
            }}
          />
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/70 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium">
            {design.userType === "tailor" ||
            design.role === roleTypeNumbers.tailor
              ? "Tailor Design"
              : "Customer Request"}
          </div>
        </div>

        <div className="p-2 sm:p-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 truncate">
            {design.title || "Untitled Design"}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
            {design.description || "No description available"}
          </p>
          {design.tags && design.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
              {design.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
              {design.tags.length > 3 && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{design.tags.length - 3}
                </span>
              )}
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 sm:mb-3 mt-1 sm:mt-2">
            <div className="flex flex-col mr-0 sm:mr-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= averageRating ? (
                      <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                    ) : (
                      <FaRegStar className="text-yellow-400 text-xs sm:text-sm" />
                    )}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {averageRating > 0
                  ? `${averageRating.toFixed(
                      0
                    )}/5 (${reviewCount} designer review${
                      reviewCount !== 1 ? "s" : ""
                    })`
                  : "No ratings yet"}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-primary mt-1 sm:mt-0">
              {formatPrice(design.price)}
            </div>
          </div>
          <CustomButton
            text="View Details"
            color="primary"
            hover_color="hoverAccent"
            variant="outlined"
            width="w-full"
            height="h-7 sm:h-8"
            type="button"
            onClick={handleViewDetails}
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-lg sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 border-b">
              <div className="flex justify-between items-center w-full sm:w-auto">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {design.title || "Untitled Design"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors sm:hidden"
                  aria-label="Close modal"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <h3 className="text-base sm:text-lg text-primary font-bold">
                  {design.price ? formatPrice(design.price) : ""}
                </h3>
                <button
                  onClick={closeModal}
                  className="hidden sm:block text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="relative bg-gray-100 rounded-xl p-4">
                {images.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-full max-h-48 sm:max-h-64">
                      <img
                        src={images[currentImageIndex] || placeholderImg}
                        alt={`${design.title || "Design"} Image ${
                          currentImageIndex + 1
                        }`}
                        className="w-full h-auto max-h-48 sm:max-h-64 object-contain rounded-lg"
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
                      {currentImageIndex === 0
                        ? "Final Product"
                        : `Detail Image ${currentImageIndex}`}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <img
                      src={placeholderImg}
                      alt="No Image Available"
                      className="w-full h-auto max-h-48 sm:max-h-64 object-contain rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      No Images Available
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end space-x-2 sm:space-x-3">
                <div className="flex items-center text-gray-500 text-xs">
                  <span>
                    {design?.createdAt &&
                      `created on ${formatDate(design.createdAt)}`}
                    {design?.updatedAt &&
                      design?.updatedAt !== design?.createdAt &&
                      `edited on ${formatDate(design.updatedAt)}`}
                  </span>
                </div>
                {isEdited && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <FaEdit className="mr-1" />
                    Edited
                  </span>
                )}
              </div>
              <div className="border-b border-primary/10 pb-4">
                <p className="text-gray-600 text-xs sm:text-sm">
                  {design.description || "No description available"}
                </p>
                {design.tags && design.tags.length > 0 && (
                  <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                    {design.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-b border-primary/10 pb-4">
                <h3 className="text-xs sm:text-sm text-gray-900 mb-2 sm:mb-3">
                  Designed by
                </h3>
                {isLoadingCreator ? (
                  <div className="flex justify-center py-4">
                    <Loader size="small" />
                  </div>
                ) : creatorDetails ? (
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={
                          creatorDetails.profilePic ||
                          creatorDetails.logoUrl ||
                          "/assets/placeholder-user.jpg"
                        }
                        alt={creatorDetails.shopName || creatorDetails.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                        {creatorDetails.role === roleTypeNumbers.tailor
                          ? creatorDetails.shopName ||
                            creatorDetails.name ||
                            "Tailor Shop"
                          : creatorDetails.name || "Customer"}
                      </h4>
                      <div className="flex space-x-3 sm:space-x-4 mt-1">
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
                  <div className="text-gray-500 text-xs sm:text-sm">
                    Creator details not available
                  </div>
                )}
              </div>
              <div className="border-b border-primary/10 pb-4">
                <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-2 sm:mb-3">
                  Designer Reviews
                </h3>
                {isLoadingReviews ? (
                  <div className="flex justify-center py-4">
                    <Loader size="small" />
                  </div>
                ) : designReviews.length > 0 ? (
                  <div className="space-y-4">
                    {designReviews.map((review, index) => (
                      <ReviewItem key={index} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-xs sm:text-sm py-2">
                    No reviews yet. Be the first to review!
                  </div>
                )}
              </div>
              {!isOwnDesign && user && (
                <div>
                  <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-2 sm:mb-3">
                    Rate this Design
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <textarea
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      width="w-full sm:w-1/3"
                      height="h-9 sm:h-10"
                    />
                  </div>
                </div>
              )}
              {isOwnDesign && (
                <div className="text-center text-xs sm:text-sm text-gray-500 italic py-2">
                  This is your design. You cannot leave a review on your own
                  work.
                </div>
              )}
              {!user && (
                <div className="text-center text-xs sm:text-sm text-gray-500 italic py-2">
                  Please log in to leave a review.
                </div>
              )}
              {user &&
                user.role === roleTypeNumbers.customer &&
                !isOwnDesign &&
                design.tailorId && (
                  <div className="mt-4 sm:mt-6 pt-2 sm:pt-3 border-t flex justify-end gap-1 sm:gap-1.5">
                    <CustomButton
                      text="Get This Tailored"
                      color="primary"
                      hover_color="hoverAccent"
                      variant="filled"
                      width="w-full sm:w-1/3"
                      height="h-7 sm:h-8"
                      onClick={handleCreateOrderClick}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Create Order
              </h2>
              <button
                onClick={closeOrderModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close order modal"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Order Type
                </label>
                <select
                  name="orderType"
                  value={orderForm.orderType}
                  onChange={handleOrderFormChange}
                  className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-sm"
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
                  className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-sm"
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
                  className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-sm"
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
                  className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-sm"
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
                  className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs sm:text-sm"
                  rows="3"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <CustomButton
                  text="Cancel"
                  color="primary"
                  hover_color="hoverAccent"
                  variant="outlined"
                  width="w-full sm:w-1/3"
                  height="h-9 sm:h-10"
                  onClick={closeOrderModal}
                />
                <CustomButton
                  text={isSubmitting ? "Submitting" : "Submit Order"}
                  color="primary"
                  hover_color="hoverAccent"
                  variant="filled"
                  width="w-full sm:w-1/3"
                  height="h-9 sm:h-10"
                  onClick={handleOrderSubmit}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DesignGallery = () => {
  const {
    designs,
    isLoading,
    error,
    fetchAllDesigns,
    fetchAllTailorDesigns,
    fetchAllCustomerDesigns,
  } = useDesignStore();
  const { fetchUserReviews } = useReviewStore();
  const { fetchCustomerById } = useCustomerStore();
  const { fetchTailorById } = useShopStore();

  const [activeFilter, setActiveFilter] = useState("all");
  const [filters, setFilters] = useState({
    type: "all",
    priceMin: "",
    priceMax: "",
    tags: [],
    address: "",
    minRating: 0,
    sortBy: "createdAt",
    sortOrder: "desc",
    dateFrom: "",
    dateTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [creatorCache, setCreatorCache] = useState({});
  const [reviewCache, setReviewCache] = useState({});

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        await fetchAllDesigns();
      } catch (err) {
        console.error("Error fetching designs:", err);
        toast.error("Failed to load designs");
      }
    };
    loadDesigns();
  }, [fetchAllDesigns]);

  useEffect(() => {
    const enrichDesigns = async () => {
      if (!designs || designs.length === 0) {
        setFilteredDesigns([]);
        return;
      }

      let designsToShow = designs;
      if (activeFilter === "tailor") {
        designsToShow = designs.filter(
          (design) =>
            design.userType === "tailor" ||
            design.role === roleTypeNumbers.tailor
        );
      } else if (activeFilter === "customer") {
        designsToShow = designs.filter(
          (design) =>
            design.userType !== "tailor" &&
            design.role !== roleTypeNumbers.tailor
        );
      }

      const enrichedDesigns = await Promise.all(
        designsToShow.map(async (design) => {
          const userId = design.tailorId || design.customerId;
          let averageRating = 0;
          let reviewCount = 0;

          if (reviewCache[userId]) {
            const reviews = reviewCache[userId];
            reviewCount = reviews.length;
            averageRating =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;
          } else {
            try {
              const response = await fetchUserReviews(userId);
              const reviews = response.reviews || [];
              reviewCount = reviews.length;
              averageRating =
                reviews.length > 0
                  ? reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length
                  : 0;
              setReviewCache((prev) => ({ ...prev, [userId]: reviews }));
            } catch (error) {
              console.error(
                `Error fetching reviews for design ${design._id}:`,
                error
              );
            }
          }

          return {
            ...design,
            averageRating,
            reviewCount,
          };
        })
      );

      setFilteredDesigns(enrichedDesigns);
    };

    enrichDesigns();
  }, [designs, activeFilter, reviewCache]);

  const handleFilterChange = async (type) => {
    setActiveFilter(type);
    setFilters((prev) => ({ ...prev, type }));
    try {
      if (type === "tailor") {
        await fetchAllTailorDesigns();
      } else if (type === "customer") {
        await fetchAllCustomerDesigns();
      } else {
        await fetchAllDesigns();
      }
    } catch (err) {
      console.error("Error fetching designs:", err);
      toast.error("Failed to load designs");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    setFilters((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, minRating: rating }));
  };

  const fetchCreatorDetails = async (design) => {
    const userId = design.tailorId || design.customerId;
    if (creatorCache[userId]) {
      return creatorCache[userId];
    }

    try {
      let creatorDetails = null;
      if (design.tailorId) {
        creatorDetails = await fetchTailorById(design.tailorId);
      } else if (design.customerId) {
        creatorDetails = await fetchCustomerById(design.customerId);
      }
      setCreatorCache((prev) => ({ ...prev, [userId]: creatorDetails }));
      return creatorDetails;
    } catch (error) {
      console.error("Error fetching creator details:", error);
      return null;
    }
  };

  const applyFilters = async () => {
    setIsFiltering(true);
    try {
      let designsToFilter = designs;
      if (filters.type === "tailor") {
        designsToFilter = designs.filter(
          (design) =>
            design.userType === "tailor" ||
            design.role === roleTypeNumbers.tailor
        );
      } else if (filters.type === "customer") {
        designsToFilter = designs.filter(
          (design) =>
            design.userType !== "tailor" &&
            design.role !== roleTypeNumbers.tailor
        );
      }

      const enrichedDesigns = await Promise.all(
        designsToFilter.map(async (design) => {
          const userId = design.tailorId || design.customerId;
          let averageRating = 0;
          let reviewCount = 0;

          if (reviewCache[userId]) {
            const reviews = reviewCache[userId];
            reviewCount = reviews.length;
            averageRating =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;
          } else {
            try {
              const response = await fetchUserReviews(userId);
              const reviews = response.reviews || [];
              reviewCount = reviews.length;
              averageRating =
                reviews.length > 0
                  ? reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length
                  : 0;
              setReviewCache((prev) => ({ ...prev, [userId]: reviews }));
            } catch (error) {
              console.error(
                `Error fetching reviews for design ${design._id}:`,
                error
              );
            }
          }

          return { ...design, averageRating, reviewCount };
        })
      );

      const filtered = await Promise.all(
        enrichedDesigns.map(async (design) => {
          let include = true;

          if (
            filters.priceMin &&
            (!design.price || design.price < parseFloat(filters.priceMin))
          ) {
            include = false;
          }
          if (
            filters.priceMax &&
            (!design.price || design.price > parseFloat(filters.priceMax))
          ) {
            include = false;
          }

          if (filters.tags.length > 0 && design.tags) {
            include = filters.tags.every((tag) => design.tags.includes(tag));
          }

          if (filters.address) {
            const creatorDetails = await fetchCreatorDetails(design);
            if (
              creatorDetails &&
              creatorDetails.address &&
              !creatorDetails.address
                .toLowerCase()
                .includes(filters.address.toLowerCase())
            ) {
              include = false;
            } else if (!creatorDetails || !creatorDetails.address) {
              include = false;
            }
          }

          if (
            filters.minRating > 0 &&
            (design.averageRating || 0) < filters.minRating
          ) {
            include = false;
          }

          if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            if (new Date(design.createdAt) < fromDate) {
              include = false;
            }
          }
          if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            if (new Date(design.createdAt) > toDate) {
              include = false;
            }
          }

          return include ? design : null;
        })
      );

      const sorted = filtered
        .filter((d) => d !== null)
        .sort((a, b) => {
          const order = filters.sortOrder === "asc" ? 1 : -1;
          if (filters.sortBy === "price") {
            return ((a.price || 0) - (b.price || 0)) * order;
          } else if (filters.sortBy === "rating") {
            return ((a.averageRating || 0) - (b.averageRating || 0)) * order;
          } else {
            return (new Date(a.createdAt) - new Date(b.createdAt)) * order;
          }
        });

      setFilteredDesigns(sorted);
      toast.success("Filters applied successfully");
    } catch (error) {
      console.error("Error applying filters:", error);
      toast.error("Failed to apply filters");
    } finally {
      setIsFiltering(false);
    }
  };

  const resetFilters = async () => {
    setIsFiltering(false);
    setFilters({
      type: "all",
      priceMin: "",
      priceMax: "",
      tags: [],
      address: "",
      minRating: 0,
      sortBy: "createdAt",
      sortOrder: "desc",
      dateFrom: "",
      dateTo: "",
    });
    setActiveFilter("all");
    try {
      await fetchAllDesigns();
      toast.success("Filters reset and all designs loaded");
    } catch (err) {
      console.error("Error resetting filters:", err);
      toast.error("Failed to reset filters");
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Design Gallery
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <CustomButton
            text="Tailor Designs"
            color={activeFilter === "tailor" ? "primary" : "gray"}
            hover_color="hoverAccent"
            variant={activeFilter === "tailor" ? "filled" : "outlined"}
            height="h-7 sm:h-8"
            width="w-28 sm:w-24"
            onClick={() => handleFilterChange("tailor")}
            aria-label="Show tailor designs"
          />
          <CustomButton
            text="Customer Requests"
            color={activeFilter === "customer" ? "primary" : "gray"}
            hover_color="hoverAccent"
            variant={activeFilter === "customer" ? "filled" : "outlined"}
            height="h-7 sm:h-8"
            width="w-28 sm:w-24"
            onClick={() => handleFilterChange("customer")}
            aria-label="Show customer designs"
          />
          <CustomButton
            text="All Designs"
            color={activeFilter === "all" ? "primary" : "gray"}
            hover_color="hoverAccent"
            variant={activeFilter === "all" ? "filled" : "outlined"}
            height="h-7 sm:h-8"
            width="w-28 sm:w-24"
            onClick={() => handleFilterChange("all")}
            aria-label="Show all designs"
          />
          <CustomButton
            text={showFilters ? "Hide Filters" : "Show Filters"}
            color="primary"
            hover_color="hoverAccent"
            variant="outlined"
            height="h-7 sm:h-8"
            width="w-28 sm:w-24"
            onClick={() => setShowFilters(!showFilters)}
            icon={showFilters ? <FaChevronUp /> : <FaChevronDown />}
            aria-label={showFilters ? "Hide filters" : "Show filters"}
          />
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Minimum Price (LKR)
              </label>
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleInputChange}
                placeholder="Min price"
                className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Maximum Price (LKR)
              </label>
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleInputChange}
                placeholder="Max price"
                className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {predefinedServices.slice(0, 5).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-2 py-1 rounded-full text-xs ${
                      filters.tags.includes(tag)
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Location
              </label>
              <input
                type="text"
                name="address"
                value={filters.address}
                onChange={handleInputChange}
                placeholder="Enter location"
                className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Minimum Rating
              </label>
              <div className="flex">
                {[0, 1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none p-1"
                  >
                    {star <= filters.minRating ? (
                      <FaStar className="text-yellow-400 text-sm" />
                    ) : (
                      <FaRegStar className="text-yellow-400 text-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Sort By
              </label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
              >
                <option value="createdAt">Date Created</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Sort Order
              </label>
              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                From Date
              </label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                To Date
              </label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 sm:py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
            <CustomButton
              text="Reset Filters"
              color="gray"
              hover_color="hoverGray"
              variant="outlined"
              width="w-full sm:w-1/4"
              height="h-9 sm:h-10"
              onClick={resetFilters}
            />
            <CustomButton
              text={isFiltering ? "Applying..." : "Apply Filters"}
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-full sm:w-1/4"
              height="h-9 sm:h-10"
              onClick={applyFilters}
              disabled={isFiltering}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : filteredDesigns.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No designs found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-8">
          {filteredDesigns.map((design) => (
            <div key={design._id} className="flex justify-center">
              <DesignCard design={design} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesignGallery;
