import classNames from "classnames";
import React from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface BaseInputProps {
  register?: UseFormRegister<FieldValues>;
  error?: FieldError;
  name: string;
  className?: string;
}

interface InputProps
  extends BaseInputProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  type?: "text" | "password" | "email";
}

interface TextareaProps
  extends BaseInputProps,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  type: "textarea";
}

type InputComponentProps = InputProps | TextareaProps;

const Input = ({
  register,
  error,
  name,
  type = "text",
  className,
  ...props
}: InputComponentProps) => {
  const inputClasses = classNames(
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2",
    "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    className,
    error && "border-red-500 focus:border-red-500 focus:ring-red-500"
  );

  if (type === "textarea") {
    const textareaProps = props as TextareaProps;
    return (
      <textarea
        {...(register ? register(name) : {})}
        {...textareaProps}
        className={inputClasses}
      />
    );
  }

  const inputProps = props as InputProps;
  return (
    <input
      type={type}
      {...(register ? register(name) : {})}
      {...inputProps}
      className={inputClasses}
    />
  );
};

export default Input;
