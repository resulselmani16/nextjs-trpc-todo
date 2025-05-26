import React from "react";
import { FieldError, UseFormRegister, Path } from "react-hook-form";
import classNames from "classnames";

interface BaseInputProps<T extends Record<string, any>> {
  register?: UseFormRegister<T>;
  error?: FieldError;
  name: Path<T>;
  className?: string;
}

interface InputProps<T extends Record<string, any>>
  extends BaseInputProps<T>,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  type?: "text" | "password" | "email";
}

interface TextareaProps<T extends Record<string, any>>
  extends BaseInputProps<T>,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  type: "textarea";
}

type InputComponentProps<T extends Record<string, any>> =
  | InputProps<T>
  | TextareaProps<T>;

const Input = React.forwardRef(
  <T extends Record<string, any>>(
    {
      register,
      error,
      name,
      type = "text",
      className,
      ...props
    }: InputComponentProps<T>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const inputClasses = classNames(
      className,
      error && "border-red-500 focus:border-red-500 focus:ring-red-500"
    );

    if (type === "textarea") {
      const textareaProps = props as TextareaProps<T>;
      return (
        <textarea
          {...(register ? register(name) : {})}
          {...textareaProps}
          className={inputClasses}
        />
      );
    }

    const inputProps = props as InputProps<T>;
    return (
      <input
        type={type}
        {...(register ? register(name) : {})}
        {...inputProps}
        ref={ref}
        className={inputClasses}
      />
    );
  }
) as <T extends Record<string, any>>(
  props: InputComponentProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => React.ReactElement;

Input.displayName = "Input";

export default Input;
