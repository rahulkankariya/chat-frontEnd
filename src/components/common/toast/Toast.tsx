import React, { useEffect } from "react";

interface ToastProps {
  id: string;
  type: "success" | "error";
  message: string;
  onClose: (id: string) => void;
  autoClose?: number;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, onClose, autoClose = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), autoClose);
    return () => clearTimeout(timer);
  }, [id, onClose, autoClose]);

  return (
    <div
      className={`flex items-center justify-between p-4 mb-2 rounded-lg shadow-md text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <span>{message}</span>
      <button onClick={() => onClose(id)} className="ml-4 hover:text-gray-200">✕</button>
    </div>
  );
};

export default Toast;
