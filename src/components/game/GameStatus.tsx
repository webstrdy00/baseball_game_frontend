import React from 'react';
import { Link } from 'react-router-dom';
import { GameStatusResponse } from '../../types/models';

interface GameStatusProps {
  gameStatus: GameStatusResponse;
  onForfeit: () => void;
  onNewGame: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({ gameStatus, onForfeit, onNewGame }) => {
  const { status, attempts_used, attempts_left } = gameStatus;
  
  // 게임 상태에 따른 메시지와 스타일 설정
  const getStatusDisplay = () => {
    switch (status) {
      case 'win':
        return {
          title: '승리!',
          message: `${attempts_used}번 만에 맞추셨습니다!`,
          className: 'bg-green-100 border-green-300 text-green-700'
        };
      case 'lose':
        return {
          title: '패배',
          message: '기회를 모두 소진했습니다.',
          className: 'bg-red-100 border-red-300 text-red-700'
        };
      case 'forfeited':
        return {
          title: '포기',
          message: '게임을 포기했습니다.',
          className: 'bg-yellow-100 border-yellow-300 text-yellow-700'
        };
      default:
        return {
          title: '게임 진행 중',
          message: `남은 기회: ${attempts_left}번`,
          className: 'bg-blue-100 border-blue-300 text-blue-700'
        };
    }
  };
  
  const statusDisplay = getStatusDisplay();
  const isGameOver = status !== 'ongoing';

  return (
    <div className="game-status-container mb-6">
      <div className={`p-4 rounded-lg border ${statusDisplay.className}`}>
        <h3 className="text-lg font-bold mb-1">{statusDisplay.title}</h3>
        <p>{statusDisplay.message}</p>
        
        <div className="mt-3 flex gap-4">
          {!isGameOver && (
            <button
              onClick={onForfeit}
              className="px-3 py-2 bg-red-500 text-white font-semibold text-sm rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              게임 포기
            </button>
          )}
          
          {isGameOver && (
            <button
              onClick={onNewGame}
              className="px-3 py-2 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 hover:text-white transition-all duration-200"
            >
              새 게임
            </button>
          )}
          
          <Link
            to="/profile"
            className="px-3 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-700 hover:text-white transition-all duration-200 inline-flex items-center justify-center"
          >
            게임 기록
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;