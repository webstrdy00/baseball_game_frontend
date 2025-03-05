import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="py-12">
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3">🎮 게임센터</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          다양한 미니게임을 즐겨보세요! 숫자야구, 테트리스 등 재미있는 게임이 여러분을 기다립니다.
        </p>
      </div>

      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 mb-10 animate-fade-in">
        {isAuthenticated ? (
          <div>
            <p className="mb-6 text-lg">
              안녕하세요, <span className="font-bold text-primary-600">{user?.username}</span>님!
              게임을 선택하거나 기존 게임 기록을 확인해보세요.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/game" 
                className="flex items-center justify-center bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 hover:text-white transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                숫자야구
              </Link>
              <Link 
                to="/tetris" 
                className="flex items-center justify-center bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 hover:text-white transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                테트리스
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 hover:text-white transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                게임 기록
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-lg">
              게임을 시작하려면 로그인하거나 회원가입하세요. 
              게스트로도 플레이할 수 있지만, 게임 기록은 저장되지 않습니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/login" 
                className="flex items-center justify-center bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 hover:text-white transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                로그인
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 hover:text-white transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                회원가입
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/game" 
                className="flex items-center justify-center bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 hover:text-gray-800 transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                숫자야구 게스트 플레이
              </Link>
              <Link 
                to="/tetris" 
                className="flex items-center justify-center bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 hover:text-gray-800 transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                테트리스 게스트 플레이
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">⚾ 숫자 야구 게임</h2>
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
            <p className="mb-4">컴퓨터가 생성한 숫자를 맞추는 추리 게임입니다. 스트라이크와 볼 힌트를 활용해 정답을 찾아보세요!</p>
            <div className="flex justify-center">
              <Link 
                to="/game" 
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                숫자야구 시작하기
              </Link>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">🧱 테트리스 게임</h2>
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
            <p className="mb-4">떨어지는 블록을 조작하여 라인을 맞추고 점수를 얻는 클래식 게임입니다. 얼마나 높은 점수를 기록할 수 있을까요?</p>
            <div className="flex justify-center">
              <Link 
                to="/tetris" 
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                테트리스 시작하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;