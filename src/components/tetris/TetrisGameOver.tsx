import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TetrisGameOver.module.css';

interface TetrisGameOverProps {
  score: number;
  level: number;
  linesCleared: number;
  onNewGame: () => void;
}

const TetrisGameOver: React.FC<TetrisGameOverProps> = ({
  score,
  level,
  linesCleared,
  onNewGame
}) => {
  const navigate = useNavigate();
  
  // 게임 오버 효과
  useEffect(() => {
    // 여기서 필요한 게임 오버 효과를 추가할 수 있습니다.
  }, []);
  
  return (
    <div className={styles.gameOverContainer}>
      <div className={styles.gameOverContent}>
        <h2 className={styles.gameOverTitle}>게임 종료</h2>
        
        <div className={styles.gameStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>최종 점수</span>
            <span className={styles.statValue}>{score}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>레벨</span>
            <span className={styles.statValue}>{level}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>제거한 라인</span>
            <span className={styles.statValue}>{linesCleared}</span>
          </div>
        </div>
        
        <div className={styles.gameOverButtons}>
          <button
            onClick={onNewGame}
            className={styles.newGameButton}
          >
            새 게임
          </button>
          <button
            onClick={() => navigate('/tetris/leaderboard')}
            className={styles.leaderboardButton}
          >
            리더보드
          </button>
        </div>
      </div>
    </div>
  );
};

export default TetrisGameOver;