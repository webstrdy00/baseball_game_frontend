import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">페이지를 찾을 수 없습니다</h2>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        찾으시는 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-center"
        >
          홈으로 돌아가기
        </Link>
        <Link
          to="/game"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
        >
          게임 시작하기
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;