import React from "react";

export const Loading = ({ fullScreen = false }) => {
  return (
    <div className={`flex justify-center items-center ${fullScreen ? "h-full w-full" : ""}`}>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
