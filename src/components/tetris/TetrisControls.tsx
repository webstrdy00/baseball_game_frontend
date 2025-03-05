import React from 'react';
import { TetrisMoveType, TetrisPiece } from '../../types/models';
import styles from './TetrisControls.module.css';

interface TetrisControlsProps {
  onMove: (moveType: TetrisMoveType) => void;
  onPause: () => void;
  onReset: () => void;
  isPaused: boolean;
  isGameOver: boolean;
  heldPiece: TetrisPiece | null;
  canHold: boolean;
}

const TetrisControls: React.FC<TetrisControlsProps> = ({
  onMove,
  onPause,
  onReset,
  isPaused,
  isGameOver,
  heldPiece,
  canHold,
}) => {
  // 홀드 버튼 클릭 핸들러
  const handleHoldClick = () => {
    console.log("홀드 버튼 클릭 - 현재 상태:", { heldPiece, canHold });
    onMove(TetrisMoveType.HOLD);
  };

  return (
    <div className={styles.tetrisControls}>
      <div className={styles.mobileControls}>
        <div className={styles.directionButtons}>
          <button
            className={styles.controlButton}
            onClick={() => onMove(TetrisMoveType.LEFT)}
            disabled={isPaused || isGameOver}
            aria-label="Move Left"
          >
            ←
          </button>
          <div className={styles.upDownButtons}>
            <button
              className={styles.controlButton}
              onClick={() => onMove(TetrisMoveType.ROTATE)}
              disabled={isPaused || isGameOver}
              aria-label="Rotate"
            >
              ↻
            </button>
            <button
              className={styles.controlButton}
              onClick={() => onMove(TetrisMoveType.DOWN)}
              disabled={isPaused || isGameOver}
              aria-label="Move Down"
            >
              ↓
            </button>
          </div>
          <button
            className={styles.controlButton}
            onClick={() => onMove(TetrisMoveType.RIGHT)}
            disabled={isPaused || isGameOver}
            aria-label="Move Right"
          >
            →
          </button>
        </div>
        <div className={styles.actionButtons}>
          <button
            className={styles.controlButton}
            onClick={() => onMove(TetrisMoveType.HARD_DROP)}
            disabled={isPaused || isGameOver}
            aria-label="Hard Drop"
          >
            ⤓
          </button>
          <button
            className={`${styles.controlButton} ${heldPiece ? styles.hasHeldPiece : ''} ${!canHold ? styles.disabledHold : ''}`}
            onClick={handleHoldClick}
            disabled={isPaused || isGameOver || !canHold}
            aria-label="Hold Block"
            title={!canHold ? "홀드 불가능" : heldPiece ? "홀드된 블록 사용" : "현재 블록 홀드"}
          >
            H
          </button>
        </div>
      </div>
      <div className={styles.gameControls}>
        <button
          className={`${styles.gameButton} ${styles.pauseButton}`}
          onClick={onPause}
          disabled={isGameOver}
        >
          {isPaused ? '게임 재개' : '일시정지'}
        </button>
        <button
          className={`${styles.gameButton} ${styles.resetButton}`}
          onClick={onReset}
        >
          재시작
        </button>
      </div>
    </div>
  );
};

export default TetrisControls;