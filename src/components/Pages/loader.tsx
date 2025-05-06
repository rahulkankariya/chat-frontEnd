import React from "react";


const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
    <div className="animate-spin rounded-full h-50 w-50 border-4 border-blue-500 border-t-transparent"></div>
  </div>
  );
};

export default Loader;
