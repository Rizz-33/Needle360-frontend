import React from "react";
import { useCustomerStore } from "../../store/Customer.store";
import { useShopStore } from "../../store/Shop.store";

const Avatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const { tailor } = useShopStore();
  const { customer } = useCustomerStore();

  // Handle both customer (profilePic) and tailor (logoUrl) image fields
  const profileImage = customer?.profilePic || tailor?.logoUrl;

  // Get display name (prioritize name, fallback to shopName for tailors)
  const displayName = customer?.name || tailor?.shopName || "";

  // Get first letter for the fallback avatar
  const firstLetter = displayName.charAt(0).toUpperCase() || "U";

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-white`}
    >
      {profileImage ? (
        <img
          src={profileImage}
          alt={displayName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-medium">
          {firstLetter}
        </div>
      )}
    </div>
  );
};

export default Avatar;
