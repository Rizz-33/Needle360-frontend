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
