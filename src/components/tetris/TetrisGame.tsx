import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTetris } from '../../context/TetrisContext';
import TetrisBoard from './TetrisBoard';
import TetrisInfo from './TetrisInfo';
import TetrisControls from './TetrisControls';
// @ts-expect-error - 파일이 존재하지만 타입스크립트가 인식하지 못하는 문제
import TetrisGameOver from './TetrisGameOver';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import styles from './TetrisGame.module.css';
import { TetrisMoveType } from '../../types/models';

interface TetrisGameProps {
  gameId: number;
}

const TetrisGame: React.FC<TetrisGameProps> = ({ gameId }) => {
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const {
    gameStatus,
    loading,
    error,
    getGameStatus,
    makeMove,
    pauseGame,
    forfeitGame,
    resetGame,
    isPaused
  } = useTetris();
  
  const navigate = useNavigate();
  
  // 초기 로딩 시에만 게임 상태 조회
  useEffect(() => {
    if (isInitialLoad) {
      const fetchGameStatus = async () => {
        await getGameStatus(gameId);
        setIsInitialLoad(false);
      };
      
      fetchGameStatus();
    }
  }, [gameId, isInitialLoad, getGameStatus]);
  
  const handleMove = (moveType: TetrisMoveType) => {
    makeMove(moveType);
  };
  
  const handlePause = () => {
    pauseGame(!isPaused);
  };
  
  const handleReset = async () => {
    if (gameStatus?.status === 'game_over') {
      resetGame();
      navigate('/tetris');
    } else {
      if (window.confirm('정말로 게임을 포기하시겠습니까?')) {
        await forfeitGame();
      }
    }
  };
  
  const handleNewGame = () => {
    resetGame();
    navigate('/tetris');
  };
  
  if (loading && !gameStatus) {
    return <LoadingSpinner message="게임 정보를 불러오는 중..." />;
  }
  
  if (error && !gameStatus) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => {
          setIsInitialLoad(true);
          getGameStatus(gameId);
        }}
      />
    );
  }
  
  if (!gameStatus) {
    return <div>게임 정보를 찾을 수 없습니다.</div>;
  }
  
  const isGameOver = gameStatus.status === 'game_over';
  
  return (
    <div className={styles.tetrisGameContainer}>
      <h2 className={styles.gameTitle}>
        테트리스
        <span className={styles.gameStatus}>
          {isGameOver ? '(게임 종료)' : isPaused ? '(일시정지)' : '(진행 중)'}
        </span>
      </h2>
      
      <div className={styles.gameContent}>
        <TetrisBoard
          board={gameStatus.board}
          currentPiece={!isPaused ? gameStatus.current_piece : null}
        />
        
        <div className={styles.sideInfo}>
          <TetrisInfo
            score={gameStatus.score}
            level={gameStatus.level}
            linesCleared={gameStatus.lines_cleared}
            nextPiece={gameStatus.next_piece}
            heldPiece={gameStatus.held_piece}
            canHold={gameStatus.can_hold}
          />
          
          <TetrisControls
            onMove={handleMove}
            onPause={handlePause}
            onReset={handleReset}
            isPaused={isPaused}
            isGameOver={isGameOver}
          />
        </div>
      </div>
      
      {isGameOver && (
        <TetrisGameOver
          score={gameStatus.score}
          level={gameStatus.level}
          linesCleared={gameStatus.lines_cleared}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
};

export default TetrisGame;