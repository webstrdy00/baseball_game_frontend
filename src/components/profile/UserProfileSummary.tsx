import React from "react";
import { User } from "../../types/models";

interface UserProfileSummaryProps {
  user: User;
  totalGames: number;
}

const UserProfileSummary: React.FC<UserProfileSummaryProps> = ({
  user,
  totalGames,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-500">가입일</p>
          <p className="font-medium">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-500">총 게임 수</p>
          <p className="font-medium">{totalGames}게임</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSummary;
