import classNames from "classnames";
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from "react-hook-form";

interface InputProps {
  placeholder?: string;
  name: string;
  type?: "text" | "textarea";
  className?: string;
  required?: boolean;
  error?: Merge<FieldError, FieldErrorsImpl<{ message: string }>>;
  register?: UseFormRegister<FieldValues>;
  value?: string;
  disabled?: boolean;
}

const Input = ({
  name,
  placeholder = name,
  type = "text",
  className,
  required = false,
  register,
  error,
  disabled = false,
  value,
}: InputProps) => {
  const addRegister = name ? { ...register?.(name) } : {};
  return (
    <>
      {type == "textarea" ? (
        <textarea
          className={classNames(
            "border focus:border-blue-600 rounded-md pl-4 py-2 focus:outline-none flex align-items-center disabled:bg-gray-200 disabled:hover:cursor-not-allowed dark:text-gray-300 text-black bg-white dark:bg-black border-gray-400",
            { "border-red-500": error },
            className
          )}
          name={name}
          placeholder={placeholder}
          id={name}
          {...addRegister}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          {...addRegister}
          className={classNames(
            "border focus:border-blue-600 rounded-md pl-4 py-2 focus:outline-none flex align-items-center disabled:bg-gray-200 disabled:hover:cursor-not-allowed dark:text-gray-300 text-black bg-white dark:bg-black border-gray-400",
            { "border-red-500": error },
            className
          )}
          required={required}
        />
      )}
      {typeof error?.message === "string" && (
        <p className="text-red-600 text-sm">{error.message}</p>
      )}
    </>
  );
};

export default Input;
