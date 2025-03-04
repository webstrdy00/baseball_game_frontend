import React from 'react';
import { TetrisMoveType } from '../../types/models';
import styles from './TetrisControls.module.css';

interface TetrisControlsProps {
  onMove: (moveType: TetrisMoveType) => void;
  onPause: () => void;
  onReset: () => void;
  isPaused: boolean;
  isGameOver: boolean;
}

const TetrisControls: React.FC<TetrisControlsProps> = ({
  onMove,
  onPause,
  onReset,
  isPaused,
  isGameOver
}) => {
  return (
    <div className={styles.tetrisControls}>
      <div className={styles.mobileControls}>
        <div className={styles.directionButtons}>
          <button
            onClick={() => onMove(TetrisMoveType.LEFT)}
            disabled={isPaused || isGameOver}
            className={styles.controlButton}
            aria-label="왼쪽으로 이동"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
          </button>
          <div className={styles.upDownButtons}>
            <button
              onClick={() => onMove(TetrisMoveType.ROTATE)}
              disabled={isPaused || isGameOver}
              className={styles.controlButton}
              aria-label="회전"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
                <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
              </svg>
            </button>
            <button
              onClick={() => onMove(TetrisMoveType.DOWN)}
              disabled={isPaused || isGameOver}
              className={styles.controlButton}
              aria-label="아래로 이동"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
                <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => onMove(TetrisMoveType.RIGHT)}
            disabled={isPaused || isGameOver}
            className={styles.controlButton}
            aria-label="오른쪽으로 이동"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>
        
        <div className={styles.actionButtons}>
          <button
            onClick={() => onMove(TetrisMoveType.HOLD)}
            disabled={isPaused || isGameOver}
            className={styles.controlButton}
            aria-label="블록 홀드"
          >
            <span>HOLD</span>
          </button>
          <button
            onClick={() => onMove(TetrisMoveType.HARD_DROP)}
            disabled={isPaused || isGameOver}
            className={styles.controlButton}
            aria-label="하드 드롭"
          >
            <span>DROP</span>
          </button>
        </div>
      </div>
      
      <div className={styles.gameControls}>
        <button
          onClick={onPause}
          disabled={isGameOver}
          className={`${styles.gameButton} ${isPaused ? styles.resume : ''}`}
        >
          {isPaused ? '게임 재개' : '일시정지'}
        </button>
        <button
          onClick={onReset}
          className={styles.gameButton}
        >
          {isGameOver ? '새 게임' : '게임 포기'}
        </button>
      </div>
    </div>
  );
};

export default TetrisControls;