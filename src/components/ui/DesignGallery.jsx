import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaRegStar,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { roleTypeNumbers } from "../../configs/User.config";
import { useCustomerStore } from "../../store/Customer.store";
import { useDesignStore } from "../../store/Design.store";
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

const DesignCard = ({ design }) => {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);

  const handleViewDetails = () => {
    setShowModal(true);
    fetchCreatorDetails();
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
      } else if (design.customerId) {
        const response = await useCustomerStore
          .getState()
          .fetchCustomerById(design.customerId);
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
      toast.warning("Please provide a rating");
      return;
    }

    try {
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
                    {star <= (design.rating || 0) ? (
                      <FaStar className="text-yellow-400 text-sm" />
                    ) : (
                      <FaRegStar className="text-yellow-400 text-sm" />
                    )}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {design.rating
                  ? `${design.rating.toFixed(1)}/5`
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
              <div className="border-b border-primary/20 pb-4">
                <p className="text-gray-600 text-sm">
                  {design.description || "No description available"}
                </p>
              </div>

              {/* Creator Details */}
              <div className="border-b pb-4">
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

              {/* Review Section */}
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
                    placeholder="Share your thoughts about this design..."
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

  useEffect(() => {
    // Fetch all designs when component mounts
    fetchAllDesigns();
    fetchAllTailorDesigns();
    fetchAllCustomerDesigns();
  }, [fetchAllDesigns, fetchAllTailorDesigns, fetchAllCustomerDesigns]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading designs: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Design Gallery</h2>
        <div className="flex space-x-3">
          <CustomButton
            text="Tailor Designs"
            color="secondary"
            hover_color="hoverSecondary"
            variant="outlined"
            onClick={fetchAllTailorDesigns}
          />
          <CustomButton
            text="Customer Requests"
            color="secondary"
            hover_color="hoverSecondary"
            variant="outlined"
            onClick={fetchAllCustomerDesigns}
          />
          <CustomButton
            text="All Designs"
            color="primary"
            hover_color="hoverPrimary"
            variant="contained"
            onClick={fetchAllDesigns}
          />
        </div>
      </div>

      {designs && designs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {designs.map((design, index) => (
            <DesignCard
              key={design._id || design.id || index}
              design={design}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Loader size="small" />
        </div>
      )}
    </div>
  );
};

export default DesignGallery;
