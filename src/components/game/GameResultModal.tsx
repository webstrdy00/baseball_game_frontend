import React from 'react';
import { useNavigate } from 'react-router-dom';

interface GameResultModalProps {
  status: 'win' | 'lose' | 'forfeited';
  attempts: number;
  answer?: string;
  onClose: () => void;
  onNewGame: () => void;
}

const GameResultModal: React.FC<GameResultModalProps> = ({
  status,
  attempts,
  answer,
  onClose,
  onNewGame
}) => {
  const navigate = useNavigate();

  // 상태에 따른 메시지 및 스타일 설정
  const getMessage = () => {
    switch (status) {
      case 'win':
        return {
          title: '축하합니다!',
          message: `${attempts}번 만에 숫자를 맞추셨습니다!`,
          color: 'bg-green-500'
        };
      case 'lose':
        return {
          title: '아쉽네요!',
          message: `기회를 모두 소진했습니다. 정답은 ${answer}입니다.`,
          color: 'bg-red-500'
        };
      case 'forfeited':
        return {
          title: '게임 포기',
          message: `게임을 포기했습니다. 정답은 ${answer}입니다.`,
          color: 'bg-yellow-500'
        };
      default:
        return {
          title: '게임 종료',
          message: '게임이 종료되었습니다.',
          color: 'bg-blue-500'
        };
    }
  };

  const resultInfo = getMessage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className={`${resultInfo.color} text-white p-4 rounded-t-lg`}>
          <h3 className="text-xl font-bold">{resultInfo.title}</h3>
        </div>
        
        <div className="p-6">
          <p className="mb-4 text-lg">{resultInfo.message}</p>
          
          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              닫기
            </button>
            <div className="space-x-2">
              <button
                onClick={onNewGame}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                새 게임
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                게임 기록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResultModal;