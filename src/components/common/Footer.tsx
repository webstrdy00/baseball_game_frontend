import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-xl font-bold mb-2">⚾ 숫자야구 & 🧱 테트리스</h3>
          <p className="text-gray-600 mb-3">재미있는 미니게임 모음</p>
          <p>&copy; {new Date().getFullYear()} 게임센터. All rights reserved.</p>
          <p className="text-gray-600 text-sm mt-1">미니게임 사이트</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;