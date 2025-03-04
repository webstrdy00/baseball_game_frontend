import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTetris } from '../context/TetrisContext';
import CreateTetrisGame from '../components/tetris/CreateTetrisGame';
import TetrisGame from '../components/tetris/TetrisGame';
import styles from './TetrisPage.module.css';

const TetrisPage: React.FC = () => {
  const { gameId } = useParams<{ gameId?: string }>();
  const { currentGame } = useTetris();
  const navigate = useNavigate();
  
  // 이미 진행 중인 게임이 있지만 다른 게임 페이지로 접근한 경우
  React.useEffect(() => {
    if (currentGame && gameId && parseInt(gameId, 10) !== currentGame.id) {
      if (window.confirm('이미 진행 중인 게임이 있습니다. 해당 게임으로 이동하시겠습니까?')) {
        navigate(`/tetris/${currentGame.id}`);
      }
    }
  }, [currentGame, gameId, navigate]);
  
  return (
    <div className={styles.tetrisPageContainer}>
      {gameId ? (
        <TetrisGame gameId={parseInt(gameId, 10)} />
      ) : (
        <>
          <h1 className={styles.pageTitle}>테트리스</h1>
          <CreateTetrisGame />
        </>
      )}
    </div>
  );
};

export default TetrisPage;