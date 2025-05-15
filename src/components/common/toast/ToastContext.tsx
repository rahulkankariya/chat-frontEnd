import React, { createContext, useContext } from "react";
import { toast, ToastContainer, ToastOptions, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastContextType {
  showToast: (type: TypeOptions, message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showToast = (type: TypeOptions, message: string, options?: ToastOptions) => {
    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "info":
        toast.info(message, options);
        break;
      case "warning":
        toast.warning(message, options);
        break;
      case "default":
      default:
        toast(message, options);
        break;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
