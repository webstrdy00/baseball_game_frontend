import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">숫자 야구 게임</h1>
        <p className="text-xl text-gray-600">3자리 숫자를 맞춰보세요!</p>
      </div>

      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        {isAuthenticated ? (
          <div>
            <p className="mb-4">
              안녕하세요, <span className="font-bold">{user?.username}</span>님!
            </p>
            <div className="flex flex-col space-y-3">
              <Link 
                to="/game" 
                className="bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition duration-200"
              >
                새 게임 시작하기
              </Link>
              <Link 
                to="/profile" 
                className="bg-green-500 text-white py-2 px-4 rounded text-center hover:bg-green-600 transition duration-200"
              >
                내 게임 기록 보기
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-4">게임을 즐기려면 로그인하세요.</p>
            <div className="flex flex-col space-y-3">
              <Link 
                to="/login" 
                className="bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition duration-200"
              >
                로그인
              </Link>
              <Link 
                to="/signup" 
                className="bg-gray-500 text-white py-2 px-4 rounded text-center hover:bg-gray-600 transition duration-200"
              >
                회원가입
              </Link>
              <Link 
                to="/game" 
                className="bg-green-500 text-white py-2 px-4 rounded text-center hover:bg-green-600 transition duration-200"
              >
                게스트로 플레이
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">게임 방법</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>컴퓨터가 중복되지 않는 3자리 숫자를 생성합니다.</li>
          <li>당신은
            <span className="font-bold"> 10번</span>
          의 기회 동안 숫자를 맞춰야 합니다.</li>
          <li>각 시도마다 스트라이크(S)와 볼(B) 개수가 표시됩니다.</li>
          <li>스트라이크(S): 숫자와 위치가 모두 일치</li>
          <li>볼(B): 숫자는 있지만 위치가 다름</li>
          <li>아웃: 일치하는 숫자가 없음</li>
        </ol>
      </div>
    </div>
  );
};

export default HomePage;