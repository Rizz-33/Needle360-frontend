import React from "react";

const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-2 bg-primary text-white rounded-full hover:bg-accent ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
