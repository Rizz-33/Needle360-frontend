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
  type = "button", // Default type is "button"
  onClick = () => {}, // Default onClick is an empty function
}) => {
  const baseStyles =
    "flex items-center justify-center gap-2 transition-all text-xs rounded-full font-medium group";

  const colorClasses = {
    primary: "bg-primary text-primary border-primary",
    secondary: "bg-secondary text-secondary border-secondary",
    accent: "bg-accent text-accent border-accent",
  };

  const variantStyles = {
    filled: `${colorClasses[color].split(" ")[0]} text-white hover:bg-accent`, // Explicit hover color
    outlined: `border ${colorClasses[color].split(" ")[2]} ${
      colorClasses[color].split(" ")[1]
    } hover:bg-secondary`,
    ghost: `${colorClasses[color].split(" ")[1]} hover:bg-secondary`,
    soft: `${colorClasses[color].split(" ")[0]}-light ${
      colorClasses[color].split(" ")[1]
    } hover:bg-accent`,
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
  };

  return (
    <button
      type={type} // Set the button type here
      className={clsx(
        baseStyles,
        variantStyles[disabled ? "disabled" : variant],
        width,
        height
      )}
      disabled={disabled}
      onClick={onClick} // Add onClick handler here
    >
      {iconLeft && <span>{React.cloneElement(iconLeft, { size: 14 })}</span>}
      {text}
      {iconRight && <span>{React.cloneElement(iconRight, { size: 14 })}</span>}
    </button>
  );
};

export { CustomButton };
