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
  type = "button",
  onClick = () => {},
  hover_color = null,
}) => {
  const baseStyles =
    "flex items-center justify-center gap-2 transition-all text-xs rounded-full font-medium group";

  // Define color classes for primary, secondary, and accent colors
  const colorClasses = {
    primary: {
      bg: "bg-primary",
      text: "text-primary",
      border: "border-primary",
      light: "bg-primary-light",
    },
    secondary: {
      bg: "bg-secondary",
      text: "text-secondary",
      border: "border-secondary",
      light: "bg-secondary-light",
    },
    accent: {
      bg: "bg-accent",
      text: "text-accent",
      border: "border-accent",
      light: "bg-accent-light",
    },
    success: {
      bg: "bg-[#28a745]",
      text: "text-[#28a745]",
      border: "border-[#28a745]",
      light: "bg-[#28a74533]",
    },
    danger: {
      bg: "bg-[#dc3545]",
      text: "text-[#dc3545]",
      border: "border-[#dc3545]",
      light: "bg-[#dc354533]",
    },
    warning: {
      bg: "bg-[#ffc107]",
      text: "text-[#ffc107]",
      border: "border-[#ffc107]",
      light: "bg-[#ffc10733]",
    },
    info: {
      bg: "bg-[#17a2b8]",
      text: "text-[#17a2b8]",
      border: "border-[#17a2b8]",
      light: "bg-[#17a2b833]",
    },
  };

  const isCustomColor = !colorClasses[color];
  const defaultColor = colorClasses[color] || {};

  // Define styles for different button variants
  const variantStyles = {
    filled: isCustomColor
      ? `bg-${color} text-white hover:bg-${color}-dark`
      : `${defaultColor.bg} text-white hover:bg-accent`,
    outlined: isCustomColor
      ? `border border-${color} text-${color} hover:bg-${color}-light`
      : `border ${defaultColor.border} ${defaultColor.text} hover:bg-secondary`,
    ghost: isCustomColor
      ? `text-${color} hover:bg-${color}-light`
      : `${defaultColor.text} hover:bg-secondary`,
    soft: isCustomColor
      ? `bg-${color}-light text-${color} hover:bg-${color}-dark`
      : `${defaultColor.light} ${defaultColor.text} hover:bg-accent`,
    text: isCustomColor
      ? `text-${color} bg-transparent hover:underline`
      : `${defaultColor.text} bg-transparent hover:underline`,
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
  };

  return (
    <button
      type={type}
      className={clsx(
        baseStyles,
        variantStyles[disabled ? "disabled" : variant],
        width,
        height
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {iconLeft && (
        <span className="icon-left">
          {React.cloneElement(iconLeft, { size: 14 })}
        </span>
      )}
      {text}
      {iconRight && (
        <span className="icon-right">
          {React.cloneElement(iconRight, { size: 14 })}
        </span>
      )}
    </button>
  );
};

export { CustomButton };
