import React, { createContext, useContext, useRef } from "react";
import ToastContainer, { ToastContainerRef, ToastType } from "./ToastContainer";

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toastRef = useRef<ToastContainerRef>(null);

  const contextValue: ToastContextType = {
    showToast: (type, message) => {
      toastRef.current?.showToast(type, message);
    },
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer ref={toastRef} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};
