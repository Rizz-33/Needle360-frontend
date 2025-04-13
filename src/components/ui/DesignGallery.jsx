import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaEye, FaTimes, FaUser } from "react-icons/fa";
import { useDesignStore } from "../../store/Design.store";
import Loader from "../ui/Loader";
import { CustomButton } from "./Button";

const DesignCard = ({ design }) => {
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Safe price formatting
  const formatPrice = (price) => {
    if (price && typeof price === "number") {
      return `LKR ${price.toFixed(2)}`;
    } else if (price) {
      // If price exists but isn't a number, just convert to string
      return `LKR ${price}`;
    }
    return "Price not specified";
  };

  // Fixed getCreatorName function to properly handle creator names
  const getCreatorName = () => {
    if (design.userType === "tailor") {
      return design.shopName || "Tailor Shop";
    } else {
      return design.name || "Customer";
    }
  };

  // Use a local placeholder instead of external URL
  const placeholderImg = "/assets/placeholder-design.jpg"; // Adjust path as needed

  return (
    <>
      {/* Design Card */}
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 ease-in-out p-4">
        {/* Card Image */}
        <div className="relative">
          <img
            className="w-full h-64 object-cover rounded-t-lg"
            src={design.imageUrl || placeholderImg}
            alt={design.title}
            onError={(e) => {
              e.target.src = placeholderImg;
              e.target.onerror = null; // Prevent infinite error loops
            }}
          />
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
            {design.userType === "tailor"
              ? "Tailor Design"
              : "Customer Request"}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-2">
          {/* Design Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {design.title || "Untitled Design"}
          </h3>

          {/* Design Description */}
          <p className="text-gray-600 text-xs mb-2 line-clamp-3">
            {design.description || "No description available"}
          </p>

          {/* User Type */}
          <div className="flex items-center text-gray-500 text-xs uppercase mb-1">
            <FaUser className="mr-1" />
            {getCreatorName()}
          </div>

          {/* Date */}
          <div className="flex items-center text-gray-500 text-xs mb-2">
            <FaCalendarAlt className="mr-1" />
            {design.createdAt
              ? new Date(design.createdAt).toLocaleDateString()
              : "Date not available"}
          </div>

          {/* Price */}
          <div className="text-sm font-semibold text-gray-800 mb-2">
            {formatPrice(design.price)}
          </div>

          <CustomButton
            text="View Details"
            color="primary"
            hover_color="hoverAccent"
            variant="outlined"
            width="w-full"
            height="h-9"
            type="button"
            onClick={handleViewDetails}
            iconRight={<FaEye className="w-3 h-3 mx-4" />}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                {design.title || "Untitled Design"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Image */}
              <div className="mb-6">
                <img
                  src={design.imageUrl || placeholderImg}
                  alt={design.title || "Design Image"}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = placeholderImg;
                    e.target.onerror = null;
                  }}
                />
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Description
                  </h3>
                  <p className="mt-1 text-gray-600">
                    {design.description || "No description available"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Type</h3>
                    <p className="mt-1 text-gray-600 capitalize">
                      {design.userType || "Unknown"} Design
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Created
                    </h3>
                    <p className="mt-1 text-gray-600">
                      {design.createdAt
                        ? new Date(design.createdAt).toLocaleDateString()
                        : "Date not available"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Price</h3>
                    <p className="mt-1 text-gray-600">
                      {formatPrice(design.price)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Last Updated
                    </h3>
                    <p className="mt-1 text-gray-600">
                      {design.updatedAt
                        ? new Date(design.updatedAt).toLocaleDateString()
                        : "Update date not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t">
              <CustomButton
                text="Close"
                color="secondary"
                hover_color="hoverSecondary"
                variant="outlined"
                onClick={closeModal}
                width="w-32"
              />
              <div className="ml-3">
                <CustomButton
                  text="Contact Designer"
                  color="primary"
                  hover_color="hoverPrimary"
                  variant="contained"
                  width="w-40"
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
    <div className="container mx-auto px-4 py-8 justify-center">
      <h2 className="text-2xl font-bold text-gray-800 m-6">All Designs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {designs && designs.length > 0 ? (
          designs.map((design, index) => (
            <DesignCard
              key={design._id || design.id || index}
              design={design}
            />
          ))
        ) : (
          <div className="col-span-full text-center p-4">
            <Loader className="w-full h-64" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignGallery;
