import React, { useMemo, useRef, useEffect } from 'react';
import styles from './TetrisBoard.module.css';

interface TetrisBoardProps {
  board: number[][];
  currentPiece?: {
    shape: number[][];
    position: number[];
    color: number;
  } | null;
  gameOver?: boolean;
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

// 개별 셀 컴포넌트를 메모이제이션하여 불필요한 리렌더링 방지
// areEqual 함수를 사용하여 더 정확한 비교 수행
const Cell = React.memo(({ color }: { color: number }) => (
  <div
    className={styles.cell}
    style={{ backgroundColor: COLORS[color] }}
  />
), (prevProps, nextProps) => {
  // 색상이 같으면 리렌더링하지 않음
  return prevProps.color === nextProps.color;
});

Cell.displayName = 'Cell';

// 행 컴포넌트도 메모이제이션
const Row = React.memo(({ row, rowIndex }: { row: number[], rowIndex: number }) => (
  <div className={styles.row}>
    {row.map((cell, x) => (
      <Cell key={`${rowIndex}-${x}`} color={cell} />
    ))}
  </div>
));

Row.displayName = 'Row';

const TetrisBoard: React.FC<TetrisBoardProps> = ({ board, currentPiece, gameOver }) => {
  // 이전 보드 상태를 저장하는 ref
  const prevBoardRef = useRef<number[][]>(null);
  
  // 현재 블록이 있는 위치를 포함한 보드 생성 (useMemo로 최적화)
  const displayBoard = useMemo(() => {
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
  }, [board, currentPiece]);
  
  // 이전 보드와 현재 보드 비교
  useEffect(() => {
    prevBoardRef.current = displayBoard;
  }, [displayBoard]);
  
  return (
    <div className={`${styles.tetrisBoard} ${gameOver ? styles.gameOver : ''}`}>
      {displayBoard.map((row, y) => (
        <Row key={y} row={row} rowIndex={y} />
      ))}
    </div>
  );
};

// 컴포넌트를 메모이제이션하여 props가 변경되지 않으면 리렌더링하지 않음
export default React.memo(TetrisBoard);