import React from 'react';
import { useParams } from 'react-router-dom';

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId?: string }>();
  
  return (
    <div className="container">
      <h1>{gameId ? `게임 #${gameId}` : '새 게임'}</h1>
      {/* 게임 보드 및 추측 입력 컴포넌트 추가 예정 */}
    </div>
  );
};

export default GamePage;