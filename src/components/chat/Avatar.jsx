// components/ui/Avatar.jsx
import React from "react";

const Avatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-white`}
    >
      {user?.profilePic ? (
        <img
          src={user.profilePic}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-medium">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
};

export default Avatar;
