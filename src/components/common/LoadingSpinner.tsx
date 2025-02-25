import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  message = "로딩 중...",
}) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return "w-4 h-4";
      case "large":
        return "w-12 h-12";
      default:
        return "w-8 h-8";
    }
  };

  return (
    <div className="loading-container flex flex-col items-center justify-center p-4">
      <div
        className={`loading-spinner ${getSize()} border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin`}
      ></div>
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
