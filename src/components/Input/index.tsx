import { FieldError, UseFormRegister } from "react-hook-form";
import classNames from "classnames";

export interface InputProps {
  id?: string;
  type?: "text" | "textarea" | "password" | "email";
  placeholder?: string;
  register?: UseFormRegister<any>;
  error?: FieldError;
  name: string;
  className?: string;
  value?: string;
}

const Input = ({
  id,
  type = "text",
  placeholder,
  register,
  error,
  name,
  className,
  value,
}: InputProps) => {
  const inputClasses = classNames(
    className,
    error && "border-red-500 focus:border-red-500 focus:ring-red-500"
  );

  if (type === "textarea") {
    return (
      <textarea
        id={id}
        placeholder={placeholder}
        {...register?.(name)}
        className={inputClasses}
        defaultValue={value}
      />
    );
  }

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      {...register?.(name)}
      className={inputClasses}
      defaultValue={value}
    />
  );
};

export default Input;
