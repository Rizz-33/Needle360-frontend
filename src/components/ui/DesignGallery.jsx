import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaRegStar,
  FaStar,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { roleTypeNumbers } from "../../configs/User.config";
import { useAuthStore } from "../../store/Auth.store";
import { useCustomerStore } from "../../store/Customer.store";
import { useDesignStore } from "../../store/Design.store";
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
          // Try to fetch as customer first
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
            // If not a customer, try as tailor
            console.log("Not a customer, trying tailor");
          }

          // Try to fetch as tailor
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
          {formatDate(review.date)}
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
      )}
    </div>
  );
};

const DesignCard = ({ design }) => {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);
  const [designReviews, setDesignReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isOwnDesign, setIsOwnDesign] = useState(false);
  const { createReview, fetchUserReviews } = useReviewStore();
  const { user } = useAuthStore();

  const handleViewDetails = () => {
    setShowModal(true);
    fetchCreatorDetails();
    fetchDesignReviews();
  };

  const closeModal = () => {
    setShowModal(false);
    setRating(0);
    setReview("");
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

        // Check if current user is the design creator
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

        // Check if current user is the design creator
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
      // Determine the userId for fetching reviews
      const userId = design.tailorId || design.customerId;

      if (userId) {
        const response = await fetchUserReviews(userId);
        // Filter reviews related to this design if needed
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
      // Get the current user from auth store
      const currentUserId = user?.id || user?._id;

      if (!currentUserId) {
        toast.error("You must be logged in to submit a review");
        return;
      }

      // Determine who to send the review to (tailor or customer)
      const revieweeId = design.tailorId || design.customerId;

      if (!revieweeId) {
        toast.error("Cannot determine who to review");
        return;
      }

      // Check if user is reviewing their own design
      if (currentUserId === revieweeId) {
        toast.error("You cannot review your own design");
        return;
      }

      // Create review data
      const reviewData = {
        clientId: currentUserId,
        rating: rating,
        comment: review,
        date: new Date(),
      };

      // Submit the review
      await createReview(revieweeId, reviewData);

      // Refresh reviews
      fetchDesignReviews();

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
    return "Price not specified";
  };

  const placeholderImg = "/assets/placeholder-design.jpg";

  const isEdited =
    design.createdAt &&
    design.updatedAt &&
    new Date(design.createdAt).getTime() !==
      new Date(design.updatedAt).getTime();

  // Calculate average rating from design reviews
  const averageRating =
    designReviews.length > 0
      ? designReviews.reduce((sum, review) => sum + review.rating, 0) /
        designReviews.length
      : design.rating || 0;

  return (
    <>
      {/* Design Card */}
      <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 ease-in-out p-4 border border-gray-100 hover:shadow-xl">
        {/* Card Image */}
        <div className="relative">
          <img
            className="w-full h-64 object-cover rounded-lg"
            src={design.imageUrl || placeholderImg}
            alt={design.title}
            onError={(e) => {
              e.target.src = placeholderImg;
              e.target.onerror = null;
            }}
          />
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
            {design.userType === "tailor" ||
            design.role === roleTypeNumbers.tailor
              ? "Tailor Design"
              : "Customer Request"}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3">
          {/* Design Title */}
          <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
            {design.title || "Untitled Design"}
          </h3>

          {/* Design Description */}
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {design.description || "No description available"}
          </p>

          <div className="flex justify-between items-start mb-3 mt-2">
            {/* Rating Section */}
            <div className="flex flex-col mr-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= averageRating ? (
                      <FaStar className="text-yellow-400 text-sm" />
                    ) : (
                      <FaRegStar className="text-yellow-400 text-sm" />
                    )}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {averageRating > 0
                  ? `${averageRating.toFixed(1)}/5 (${
                      designReviews.length
                    } review${designReviews.length !== 1 ? "s" : ""})`
                  : "No ratings yet"}
              </span>
            </div>

            {/* Price */}
            <div className="text-sm font-bold text-primary">
              {formatPrice(design.price)}
            </div>
          </div>

          <CustomButton
            text="Check It Out"
            color="primary"
            hover_color="hoverAccent"
            variant="outlined"
            width="w-full"
            height="h-8"
            type="button"
            onClick={handleViewDetails}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {design.title || "Untitled Design"}
              </h2>
              <h3 className="text-lg text-primary font-bold">
                {design.price
                  ? formatPrice(design.price)
                  : "Price not specified"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Full-width Image */}
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={design.imageUrl || placeholderImg}
                  alt={design.title || "Design Image"}
                  className="w-full h-auto max-h-[400px] object-contain"
                  onError={(e) => {
                    e.target.src = placeholderImg;
                    e.target.onerror = null;
                  }}
                />
              </div>

              {/* Date and Edited Tag */}
              <div className="flex items-center justify-end space-x-3">
                <div className="flex items-center text-gray-500 text-xs">
                  <span>{formatDate(design.createdAt)}</span>
                </div>
                {isEdited && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <FaEdit className="mr-1" />
                    Edited
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="border-b border-primary/10 pb-4">
                <p className="text-gray-600 text-sm">
                  {design.description || "No description available"}
                </p>
              </div>

              {/* Creator Details */}
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
                          creatorDetails.logoUrl ||
                          "/assets/placeholder-user.jpg"
                        }
                        alt={creatorDetails.shopName || creatorDetails.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">
                        {creatorDetails.role === roleTypeNumbers.tailor
                          ? creatorDetails.shopName ||
                            creatorDetails.name ||
                            "Tailor Shop"
                          : creatorDetails.name || "Customer"}
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

              {/* Reviews Display Section */}
              <div className="border-b border-primary/10 pb-4">
                <h3 className="text-md font-semibold text-gray-900 mb-3">
                  Reviews
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
                  <div className="text-gray-500 text-sm py-2">
                    No reviews yet. Be the first to review!
                  </div>
                )}
              </div>

              {/* Add Review Section - Only show if user is not the design creator */}
              {!isOwnDesign && user && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    Rate this Design
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <textarea
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
              )}

              {/* Message if user is viewing their own design */}
              {isOwnDesign && (
                <div className="text-center text-xs text-gray-500 italic py-2">
                  This is your design. You cannot leave a review on your own
                  work.
                </div>
              )}

              {/* Message if user is not logged in */}
              {!user && (
                <div className="text-center text-gray-500 italic py-2">
                  Please log in to leave a review.
                </div>
              )}
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
    tailorDesigns,
    customerDesigns,
    isLoading,
    error,
    fetchAllDesigns,
    fetchAllTailorDesigns,
    fetchAllCustomerDesigns,
  } = useDesignStore();

  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    // Fetch all designs when component mounts
    fetchAllDesigns();
  }, [fetchAllDesigns]);

  const handleFilterChange = async (filter) => {
    setActiveFilter(filter);

    try {
      if (filter === "tailor") {
        await fetchAllTailorDesigns();
      } else if (filter === "customer") {
        await fetchAllCustomerDesigns();
      } else {
        await fetchAllDesigns();
      }
    } catch (err) {
      console.error("Error fetching designs:", err);
    }
  };

  const getDisplayedDesigns = () => {
    switch (activeFilter) {
      case "tailor":
        return tailorDesigns;
      case "customer":
        return customerDesigns;
      default:
        return designs;
    }
  };

  const displayedDesigns = getDisplayedDesigns();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Design Gallery</h2>
        <div className="flex space-x-3">
          <CustomButton
            text="Tailor Designs"
            color={activeFilter === "tailor" ? "primary" : "hoverAccent"}
            hover_color="hoverAccent"
            variant={activeFilter === "tailor" ? "filled" : "outlined"}
            height="h-8"
            width="w-24"
            onClick={() => handleFilterChange("tailor")}
          />
          <CustomButton
            text="Customer Requests"
            color={activeFilter === "customer" ? "primary" : "hoverAccent"}
            hover_color="hoverAccent"
            variant={activeFilter === "customer" ? "filled" : "outlined"}
            height="h-8"
            width="w-32"
            onClick={() => handleFilterChange("customer")}
          />
          <CustomButton
            text="All Designs"
            color={activeFilter === "all" ? "primary" : "hoverAccent"}
            hover_color="hoverAccent"
            variant={activeFilter === "all" ? "filled" : "outlined"}
            height="h-8"
            width="w-20"
            onClick={() => handleFilterChange("all")}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">
          Error loading designs: {error}
        </div>
      ) : displayedDesigns && displayedDesigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedDesigns.map((design, index) => (
            <DesignCard
              key={design._id || design.id || index}
              design={design}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No designs found for the selected filter
          </p>
        </div>
      )}
    </div>
  );
};

export default DesignGallery;
