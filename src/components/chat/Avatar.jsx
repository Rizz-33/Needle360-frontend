import { useEffect } from "react";
import { useCustomerStore } from "../../store/Customer.store";
import { useShopStore } from "../../store/Shop.store";

const Avatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const { customer } = useCustomerStore();
  const { tailor, fetchTailorById } = useShopStore();

  useEffect(() => {
    if (user?.role === 4 && user?._id && !tailor) {
      fetchTailorById(user._id);
    }
  }, [user, tailor, fetchTailorById]);

  const profileImage =
    user?.role === 4
      ? tailor?.logoUrl || user?.logoUrl
      : user?.profilePic || customer?.profilePic;

  const displayName =
    user?.role === 4
      ? tailor?.shopName || user?.shopName || user?.name
      : user?.name || customer?.name || "";

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
