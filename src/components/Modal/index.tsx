import classNames from "classnames";
import React, { ReactNode, useEffect } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  className?: string;
}
const Modal = ({ onClose, children, className }: ModalProps) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      onClick={onClose}
      className="z-50 flex items-center justify-center fixed h-screen w-full inset-0 bg-[#0000005a] overflow-hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={classNames(
          "z-10 lg:h-2/3 bg-white lg:w-3/5 flex items-center justify-center right-0 left-0 top-0 bottom-0",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
