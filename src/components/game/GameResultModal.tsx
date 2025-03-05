import React from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

interface GameResultModalProps {
  status: 'win' | 'lose' | 'forfeited';
  attempts: number;
  answer: string;
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

  // 승리 시 축하 효과
  React.useEffect(() => {
    if (status === 'win') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // 양쪽에서 색종이 발사
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
        });
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [status]);

  // 상태에 따른 메시지 및 스타일 설정
  const getMessage = () => {
    switch (status) {
      case 'win':
        return {
          title: '축하합니다!',
          message: `${attempts}번 만에 숫자를 맞추셨습니다!`,
          color: 'bg-green-500',
          icon: (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'lose':
        return {
          title: '아쉽네요!',
          message: `기회를 모두 소진했습니다. 정답은 ${answer}입니다.`,
          color: 'bg-red-500',
          icon: (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      case 'forfeited':
        return {
          title: '게임 포기',
          message: `게임을 포기했습니다. 정답은 ${answer}입니다.`,
          color: 'bg-yellow-500',
          icon: (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      default:
        return {
          title: '게임 종료',
          message: '게임이 종료되었습니다.',
          color: 'bg-blue-500',
          icon: null
        };
    }
  };

  const resultInfo = getMessage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-slide-up">
        <div className={`${resultInfo.color} text-white p-6 rounded-t-lg flex items-center`}>
          <div className="mr-4">
            {resultInfo.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{resultInfo.title}</h3>
            <p className="mt-1 text-white text-opacity-90">{resultInfo.message}</p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">정답</span>
              <span className="text-3xl font-mono font-bold">{answer}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">시도 횟수</span>
              <span className="text-xl font-semibold">{attempts}회</span>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              닫기
            </button>
            <div className="space-x-4">
              <button
                onClick={onNewGame}
                className="px-4 py-2 bg-primary-600 text-white font-semibold rounded hover:bg-primary-700 hover:text-white transition-all duration-200"
              >
                새 게임
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 hover:text-white transition-all duration-200"
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