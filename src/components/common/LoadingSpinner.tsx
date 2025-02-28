import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = '로딩 중...' 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 'w-5 h-5';
      case 'large': return 'w-12 h-12';
      default: return 'w-8 h-8';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${getSize()} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}></div>
      {message && <p className="mt-3 text-gray-600 text-center">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;