import clsx from "clsx";
import React from "react";

const CustomButton = ({
  text = "Button",
  color = "primary",
  variant = "filled",
  iconLeft = null,
  iconRight = null,
  disabled = false,
  width = "w-auto",
  height = "h-auto",
}) => {
  const baseStyles =
    "flex items-center justify-center gap-2 transition-all text-xs rounded-full font-medium group";

  const variantStyles = {
    filled: `bg-${color} text-white hover:bg-accent`, // Explicit hover color
    outlined: `border border-${color} text-${color} hover:bg-secondary`,
    ghost: `text-${color} hover:bg-secondary`,
    soft: `bg-${color}-light text-${color} hover:bg-accent`,
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[disabled ? "disabled" : variant],
        width,
        height
      )}
      disabled={disabled}
    >
      {iconLeft && <span>{React.cloneElement(iconLeft, { size: 14 })}</span>}
      {text}
      {iconRight && <span>{React.cloneElement(iconRight, { size: 14 })}</span>}
    </button>
  );
};

export { CustomButton };
