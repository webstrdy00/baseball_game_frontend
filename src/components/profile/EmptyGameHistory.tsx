import React from "react";
import { Link } from "react-router-dom";

const EmptyGameHistory: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <svg
        className="w-16 h-16 mx-auto text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        게임 기록이 없습니다
      </h3>
      <p className="mt-2 text-gray-500">
        아직 게임을 플레이하지 않았습니다. 새 게임을 시작해보세요!
      </p>
      <div className="mt-6">
        <Link
          to="/game"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          새 게임 시작하기
        </Link>
      </div>
    </div>
  );
};

export default EmptyGameHistory;
