import React from 'react';
import styles from './TetrisInfo.module.css';
import { TetrisPiece } from '../../types/models';

interface TetrisInfoProps {
  score: number;
  level: number;
  linesCleared: number;
  nextPiece: TetrisPiece | null;
  heldPiece: TetrisPiece | null;
  canHold: boolean;
}

// 테트리스 블록 색상 매핑
const COLORS = [
  'transparent',  // 0: 빈 칸
  '#00f0f0',      // 1: I 블록 (청록색)
  '#0000f0',      // 2: J 블록 (파란색)
  '#f0a000',      // 3: L 블록 (주황색)
  '#f0f000',      // 4: O 블록 (노란색)
  '#00f000',      // 5: S 블록 (녹색)
  '#a000f0',      // 6: T 블록 (보라색)
  '#f00000'       // 7: Z 블록 (빨간색)
];

const TetrisInfo: React.FC<TetrisInfoProps> = ({ 
  score,
  level,
  linesCleared,
  nextPiece,
  heldPiece,
  canHold
}) => {
  // 미니 블록 표시 컴포넌트
  const PiecePreview = ({ piece, title, disabled = false }: { piece: TetrisPiece | null, title: string, disabled?: boolean }) => {
    if (!piece) {
      return (
        <div className={styles.previewContainer}>
          <h3 className={styles.previewTitle}>{title}</h3>
          <div className={styles.emptyPreview}></div>
        </div>
      );
    }
    
    const { shape, color } = piece;
    
    return (
      <div className={`${styles.previewContainer} ${disabled ? styles.disabled : ''}`}>
        <h3 className={styles.previewTitle}>{title}</h3>
        <div className={styles.piecePreview}>
          {shape.map((row, y) => (
            <div key={y} className={styles.previewRow}>
              {row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className={styles.previewCell}
                  style={{ 
                    backgroundColor: cell !== 0 ? COLORS[color] : 'transparent',
                    opacity: disabled ? 0.5 : 1
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className={styles.tetrisInfo}>
      <div className={styles.scoreInfo}>
        <div className={styles.scoreItem}>
          <span>점수</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>
        <div className={styles.scoreItem}>
          <span>레벨</span>
          <span className={styles.scoreValue}>{level}</span>
        </div>
        <div className={styles.scoreItem}>
          <span>제거한 라인</span>
          <span className={styles.scoreValue}>{linesCleared}</span>
        </div>
      </div>
      
      <div className={styles.pieceInfo}>
        <PiecePreview piece={nextPiece} title="다음 블록" />
        <PiecePreview piece={heldPiece} title="저장 블록" disabled={!canHold} />
      </div>
      
      <div className={styles.controls}>
        <h3>조작 방법</h3>
        <ul className={styles.controlsList}>
          <li>←/→: 좌우 이동</li>
          <li>↓: 아래로 이동</li>
          <li>↑: 회전</li>
          <li>스페이스바: 하드 드롭</li>
          <li>C: 블록 홀드</li>
          <li>P: 일시정지</li>
        </ul>
      </div>
    </div>
  );
};

export default TetrisInfo;