import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTetris } from '../../context/TetrisContext';
import TetrisBoard from './TetrisBoard';
import TetrisInfo from './TetrisInfo';
import TetrisControls from './TetrisControls';
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
  
  // useCallback으로 함수 메모이제이션
  const handleMove = useCallback((moveType: TetrisMoveType) => {
    makeMove(moveType);
  }, [makeMove]);
  
  // useCallback으로 함수 메모이제이션
  const handlePause = useCallback(() => {
    pauseGame(!isPaused);
  }, [pauseGame, isPaused]);
  
  // useCallback으로 함수 메모이제이션
  const handleReset = useCallback(async () => {
    if (gameStatus?.status === 'game_over') {
      resetGame();
      navigate('/tetris');
    } else {
      if (window.confirm('정말로 게임을 포기하시겠습니까?')) {
        await forfeitGame();
      }
    }
  }, [gameStatus, resetGame, navigate, forfeitGame]);
  
  // useCallback으로 함수 메모이제이션
  const handleNewGame = useCallback(() => {
    resetGame();
    navigate('/tetris');
  }, [resetGame, navigate]);
  
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
      {loading ? (
        <div className={styles.loadingContainer}>
          <p>게임을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>오류가 발생했습니다: {error}</p>
          <button
            className={styles.gameButton}
            onClick={() => navigate('/tetris')}
          >
            테트리스 페이지로 돌아가기
          </button>
        </div>
      ) : (
        <>
          <div className={styles.gameStatus}>
            <p>
              <strong>레벨:</strong> {gameStatus.level} | <strong>점수:</strong>{' '}
              {gameStatus.score} | <strong>라인:</strong> {gameStatus.lines_cleared}
            </p>
          </div>
          <div className={styles.gameContent}>
            <TetrisBoard
              board={gameStatus.board}
              currentPiece={!isPaused ? gameStatus.current_piece : null}
              gameOver={isGameOver}
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
                heldPiece={gameStatus.held_piece}
                canHold={gameStatus.can_hold}
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
        </>
      )}
    </div>
  );
};

export default TetrisGame;