import React from "react";

export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading your store...</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
