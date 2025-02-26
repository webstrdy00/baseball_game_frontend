import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import CreateGame from '../components/game/CreateGame';
import GameBoard from '../components/game/GameBoard';

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId?: string }>();
  const { currentGame } = useGame();
  const navigate = useNavigate();
  
  // 이미 진행 중인 게임이 있지만 다른 게임 페이지로 접근한 경우
  React.useEffect(() => {
    if (currentGame && gameId && parseInt(gameId, 10) !== currentGame.id) {
      if (window.confirm('이미 진행 중인 게임이 있습니다. 해당 게임으로 이동하시겠습니까?')) {
        navigate(`/game/${currentGame.id}`);
      }
    }
  }, [currentGame, gameId, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      {gameId ? (
        <GameBoard gameId={parseInt(gameId, 10)} />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">숫자 야구 게임</h1>
          <CreateGame />
        </>
      )}
    </div>
  );
};

export default GamePage;