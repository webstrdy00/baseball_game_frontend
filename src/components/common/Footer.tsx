import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">⚾ 숫자야구 게임</h3>
            <p className="text-gray-400 mt-1">재미있는 숫자 맞추기 게임</p>
          </div>
          
          <div className="text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} 숫자야구. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-1">React & FastAPI로 만든 숫자 야구 게임</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;