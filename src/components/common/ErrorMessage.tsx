import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="error-message bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
      <p>{message}</p>
      {onRetry && (
        <button
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onRetry}
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
