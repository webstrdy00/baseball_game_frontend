import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="py-12">
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3">⚾ 숫자 야구 게임</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          랜덤으로 생성된 숫자를 맞추는 추리 게임입니다. 
          스트라이크와 볼 힌트를 이용해 정답을 찾아보세요!
        </p>
      </div>

      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 mb-10 animate-fade-in">
        {isAuthenticated ? (
          <div>
            <p className="mb-6 text-lg">
              안녕하세요, <span className="font-bold text-primary-600">{user?.username}</span>님!
              새 게임을 시작하거나 기존 게임 기록을 확인해보세요.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/game" 
                className="flex items-center justify-center bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 hover:text-white transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                새 게임 시작하기
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 hover:text-white transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                내 게임 기록 보기
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
            <div className="mt-4">
              <Link 
                to="/game" 
                className="flex items-center justify-center bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 hover:text-gray-800 transition w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                게스트로 플레이
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">게임 방법</h2>
        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
          <ol className="list-decimal list-inside space-y-4">
            <li className="pl-2">
              <span className="font-semibold">게임 시작:</span> 컴퓨터가 중복되지 않는 3~5자리 숫자를 무작위로 생성합니다.
            </li>
            <li className="pl-2">
              <span className="font-semibold">숫자 추측:</span> 10번의 기회 동안 정답을 맞춰야 합니다. 각 시도마다 정답과 일치하는 정도에 따라 힌트를 얻습니다.
            </li>
            <li className="pl-2">
              <span className="font-semibold">힌트 이해:</span>
              <ul className="list-disc list-inside pl-6 mt-2 space-y-1">
                <li><span className="font-bold text-blue-600">스트라이크(S)</span>: 숫자와 위치가 모두 일치</li>
                <li><span className="font-bold text-green-600">볼(B)</span>: 숫자는 있지만 위치가 다름</li>
                <li><span className="font-bold text-red-600">아웃</span>: 해당하는 숫자가 없음</li>
              </ul>
            </li>
            <li className="pl-2">
              <span className="font-semibold">게임 승리:</span> 정답을 맞추면 승리! 시도 횟수가 기록됩니다.
            </li>
            <li className="pl-2">
            <span className="font-semibold">게임 종료:</span> 10번의 기회를 모두 사용하거나 정답을 맞추면 게임이 종료됩니다.
            </li>
          </ol>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">예시</h3>
            <p className="mb-3">정답이 <span className="font-mono font-bold">123</span>이라면:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded mr-3 w-12 text-center">456</span>
                <span>0 스트라이크, 0 볼 (아웃: 모든 숫자가 없음)</span>
              </li>
              <li className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded mr-3 w-12 text-center">735</span>
                <span>0 스트라이크, 1 볼 (3이 있지만 위치가 다름)</span>
              </li>
              <li className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded mr-3 w-12 text-center">321</span>
                <span>1 스트라이크, 2 볼 (1의 위치만 같고, 2와 3은 있지만 위치가 다름)</span>
              </li>
              <li className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded mr-3 w-12 text-center">123</span>
                <span>3 스트라이크, 0 볼 (정답!)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;