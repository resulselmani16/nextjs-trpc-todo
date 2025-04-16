import classNames from "classnames";
import React from "react";
interface ButtonProps {
  type?: "button" | "submit" | "reset";
  text?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "iconButton" | "confirm" | "cancel";
  icon?: React.ReactNode;
}
const Button = ({
  text,
  variant = "primary",
  type = "button",
  onClick,
  className,
  disabled = false,
  icon,
}: ButtonProps) => {
  const variantStyles = {
    primary:
      "text-white bg-black hover:bg-white hover:text-black p-2 rounded-md border hover:border-black",
    secondary:
      "text-black bg-white hover:bg-black p-2 rounded-md border hover:text-white hover:border-white",
    iconButton: "mx-2 hover:scale-110 transition-transform duration-100",
    confirm:
      "text-white bg-black p-2 rounded-md border hover:bg-green-500 hover:text-white",
    cancel:
      "text-black bg-white p-2 rounded-md border hover:bg-red-500 hover:text-white",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={classNames(
        "inline-flex disabled:cursor-not-allowed items-center gap-2 rounded-md transition-colors",
        className,
        variantStyles[variant],
        {
          "!p-0": variant == "iconButton",
        }
      )}
      onClick={onClick}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
