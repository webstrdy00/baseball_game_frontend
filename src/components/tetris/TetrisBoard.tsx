import React from 'react';
import styles from './TetrisBoard.module.css';

interface TetrisBoardProps {
  board: number[][];
  currentPiece?: {
    shape: number[][];
    position: number[];
    color: number;
  } | null;
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

const TetrisBoard: React.FC<TetrisBoardProps> = ({ board, currentPiece }) => {
  // 현재 블록이 있는 위치를 포함한 보드 생성
  const renderBoard = () => {
    // 보드 복사
    const displayBoard = board.map(row => [...row]);
    
    // 현재 블록이 있으면 보드에 추가
    if (currentPiece) {
      const { shape, position } = currentPiece;
      const [pieceY, pieceX] = position;
      
      shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const boardY = pieceY + y;
            const boardX = pieceX + x;
            
            // 보드 범위 내에 있는지 확인
            if (
              boardY >= 0 &&
              boardY < displayBoard.length &&
              boardX >= 0 &&
              boardX < displayBoard[0].length
            ) {
              displayBoard[boardY][boardX] = cell;
            }
          }
        });
      });
    }
    
    return displayBoard;
  };
  
  const displayBoard = renderBoard();
  
  return (
    <div className={styles.tetrisBoard}>
      {displayBoard.map((row, y) => (
        <div key={y} className={styles.row}>
          {row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={styles.cell}
              style={{ backgroundColor: COLORS[cell] }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TetrisBoard;