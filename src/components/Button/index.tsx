import React from "react";
import classNames from "classnames";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  text?: string;
  icon?: React.ReactNode;
}

const Button = ({
  variant = "primary",
  className,
  text,
  children,
  icon,
  ...props
}: ButtonProps) => {
  const buttonClasses = classNames(
    className,
    "flex items-center gap-2 justify-around mx-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",
    {
      "text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500":
        variant === "primary",
      "text-primary-700 bg-primary-100 hover:bg-primary-200 focus:ring-primary-500":
        variant === "secondary",
      "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500":
        variant === "danger",
    }
  );

  return (
    <button className={buttonClasses} {...props}>
      {icon && <span>{icon}</span>}
      {text && <span>{text}</span>}
      {children}
    </button>
  );
};

export default Button;
