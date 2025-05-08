import React, { useState, useImperativeHandle, forwardRef } from "react";
import Toast from "./Toast";
import { v4 as uuidv4 } from "uuid";

export type ToastType = "success" | "error";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastContainerRef {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContainer = forwardRef<ToastContainerRef>((_, ref) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useImperativeHandle(ref, () => ({
    showToast,
  }));

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
});

export default ToastContainer;
