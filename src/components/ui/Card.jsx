import React from "react";

// Card component with customizable className and children
export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

// CardContent component with customizable className and children
export const CardContent = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
