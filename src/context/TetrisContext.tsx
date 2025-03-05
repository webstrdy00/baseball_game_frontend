import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import {
  createTetrisGame,
  getTetrisGameStatus,
  makeMove,
  pauseGame,
  forfeitTetrisGame
} from '../api/tetris';
import {
  CreateTetrisGameResponse,
  TetrisGameStatusResponse,
  TetrisMoveType,
  TetrisMoveResponse
} from '../types/models';

// 현재 테트리스 게임 정보 타입
interface CurrentTetrisGame {
  id: number;
  width: number;
  height: number;
  level: number;
}

// 테트리스 컨텍스트 타입 정의
interface TetrisContextType {
  currentGame: CurrentTetrisGame | null;
  gameStatus: TetrisGameStatusResponse | null;
  loading: boolean;
  error: string | null;
  createGame: (options?: { width?: number; height?: number; level?: number }) => Promise<CreateTetrisGameResponse | null>;
  makeMove: (moveType: TetrisMoveType) => Promise<TetrisMoveResponse | null>;
  getGameStatus: (gameId?: number) => Promise<TetrisGameStatusResponse | null>;
  pauseGame: (paused: boolean) => Promise<void>;
  forfeitGame: () => Promise<void>;
  resetGame: () => void;
  hasActiveGame: boolean;
  isPaused: boolean;
}

// 기본값 생성
const defaultTetrisContext: TetrisContextType = {
  currentGame: null,
  gameStatus: null,
  loading: false,
  error: null,
  createGame: async () => null,
  makeMove: async () => null,
  getGameStatus: async () => null,
  pauseGame: async () => {},
  forfeitGame: async () => {},
  resetGame: () => {},
  hasActiveGame: false,
  isPaused: false
};

// 컨텍스트 생성
const TetrisContext = createContext<TetrisContextType>(defaultTetrisContext);

// Provider props 타입 정의
interface TetrisProviderProps {
  children: ReactNode;
}

// 키보드 이벤트 처리를 위한 키 매핑
const keyMappings: Record<string, TetrisMoveType> = {
  'ArrowLeft': TetrisMoveType.LEFT,
  'ArrowRight': TetrisMoveType.RIGHT,
  'ArrowDown': TetrisMoveType.DOWN,
  'ArrowUp': TetrisMoveType.ROTATE,
  ' ': TetrisMoveType.HARD_DROP, // 스페이스바
  'c': TetrisMoveType.HOLD,
  'C': TetrisMoveType.HOLD,
  'h': TetrisMoveType.HOLD, // 'h' 키도 홀드 기능으로 추가
  'H': TetrisMoveType.HOLD  // 'H' 키도 홀드 기능으로 추가
};

// TetrisProvider 컴포넌트
export const TetrisProvider: React.FC<TetrisProviderProps> = ({ children }) => {
  const [currentGame, setCurrentGame] = useState<CurrentTetrisGame | null>(null);
  const [gameStatus, setGameStatus] = useState<TetrisGameStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // 게임 일시정지/재개
  const togglePause = useCallback(async (): Promise<void> => {
    if (!currentGame || !gameStatus || gameStatus.status === 'game_over') {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newPausedState = !isPaused;
      await pauseGame(currentGame.id, newPausedState);
      setIsPaused(newPausedState);
      
      // 게임 상태 업데이트
      const statusData = await getTetrisGameStatus(currentGame.id);
      setGameStatus(statusData);
    } catch (err: unknown) {
      console.error("일시정지 오류:", err);
      setError(
        typeof err === "object" && err !== null && "detail" in err
          ? (err.detail as string)
          : "일시정지 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [currentGame, gameStatus, isPaused, setLoading, setError, setIsPaused, setGameStatus]);

  // 블록 이동
  const moveBlock = useCallback(async (moveType: TetrisMoveType): Promise<TetrisMoveResponse | null> => {
    if (!currentGame || !gameStatus || gameStatus.status !== 'ongoing' || isPaused) {
      return null;
    }

    // 홀드 기능 사용 가능 여부 확인 및 디버깅 로그 추가
    if (moveType === TetrisMoveType.HOLD) {
      console.log("홀드 시도 - 현재 can_hold 상태:", gameStatus.can_hold);
      if (!gameStatus.can_hold) {
        console.log("홀드 기능을 사용할 수 없습니다.");
        return null;
      }
      
      // 홀드 블록이 있는지 확인
      const isUsingHeldPiece = gameStatus.held_piece !== null;
      console.log("홀드 블록 사용 여부:", isUsingHeldPiece);
    }

    // 하드 드롭 시에는 로딩 상태를 표시하지 않음
    // 홀드 기능만 로딩 상태 표시
    const isImportantMove = moveType === TetrisMoveType.HOLD;
    if (isImportantMove) {
      setLoading(true);
    }
    
    setError(null);
    try {
      console.log(`${moveType} 이동 요청 전송`);
      const moveData = await makeMove(currentGame.id, { move_type: moveType });
      console.log(`${moveType} 이동 응답:`, moveData);

      // 게임 상태 업데이트
      if (moveData.status !== 'ongoing') {
        // 게임 상태가 변경되었을 때 (게임 오버 등) 전체 상태 조회
        const statusData = await getTetrisGameStatus(currentGame.id);
        console.log("게임 상태 변경 후 상태 조회:", statusData);
        
        // 홀드 기능 사용 시 특별 처리
        if (moveType === TetrisMoveType.HOLD) {
          // 홀드 블록이 있었다면 비우기
          if (gameStatus.held_piece) {
            statusData.held_piece = null;
          }
        }
        // 다른 경우에는 홀드된 블록 정보 유지
        else if (gameStatus.held_piece && !statusData.held_piece) {
          console.log("홀드 정보 유지:", gameStatus.held_piece);
          statusData.held_piece = gameStatus.held_piece;
          
          // 홀드 사용 가능 여부도 유지
          if (gameStatus.can_hold !== undefined) {
            statusData.can_hold = gameStatus.can_hold;
          }
        }
        
        setGameStatus(statusData);
      } else {
        // 성능 최적화를 위해 API 응답으로 직접 상태 업데이트
        // 함수형 업데이트를 사용하여 최신 상태 보장
        setGameStatus(prevStatus => {
          if (!prevStatus) return null;
          
          // 하드 드롭이나 홀드의 경우 항상 업데이트 (깜빡임 방지)
          if (moveType === TetrisMoveType.HARD_DROP || moveType === TetrisMoveType.HOLD) {
            console.log("하드 드롭/홀드 후 상태 업데이트:", {
              held_piece: moveData.held_piece || prevStatus.held_piece,
              can_hold: moveData.can_hold
            });
            
            // 홀드 기능 사용 시 특별 처리
            if (moveType === TetrisMoveType.HOLD && prevStatus.held_piece) {
              // 홀드 블록을 사용한 경우 홀드 블록을 비움
              console.log("홀드 블록 사용 후 비우기");
              return {
                ...prevStatus,
                board: moveData.board,
                current_piece: moveData.current_piece,
                next_piece: moveData.next_piece,
                held_piece: null, // 홀드 블록 비우기
                score: moveData.score,
                level: moveData.level,
                lines_cleared: moveData.lines_cleared,
                can_hold: moveData.can_hold,
                status: moveData.status
              };
            }
            
            return {
              ...prevStatus,
              board: moveData.board,
              current_piece: moveData.current_piece,
              next_piece: moveData.next_piece,
              held_piece: moveData.held_piece || prevStatus.held_piece, // 홀드 정보 유지
              score: moveData.score,
              level: moveData.level,
              lines_cleared: moveData.lines_cleared,
              can_hold: moveData.can_hold,
              status: moveData.status
            };
          }
          
          // 이전 상태와 새 상태가 동일한 경우 리렌더링 방지
          if (
            JSON.stringify(prevStatus.board) === JSON.stringify(moveData.board) &&
            JSON.stringify(prevStatus.current_piece) === JSON.stringify(moveData.current_piece) &&
            prevStatus.score === moveData.score &&
            prevStatus.level === moveData.level &&
            prevStatus.lines_cleared === moveData.lines_cleared
          ) {
            return prevStatus;
          }
          
          // 모든 이동 타입에 대해 held_piece 정보 유지
          console.log("일반 이동 후 상태 업데이트:", {
            held_piece: moveData.held_piece || prevStatus.held_piece,
            can_hold: moveData.can_hold
          });
          return {
            ...prevStatus,
            board: moveData.board,
            current_piece: moveData.current_piece,
            next_piece: moveData.next_piece,
            held_piece: moveData.held_piece || prevStatus.held_piece, // held_piece가 null이면 이전 상태 유지
            score: moveData.score,
            level: moveData.level,
            lines_cleared: moveData.lines_cleared,
            can_hold: moveData.can_hold,
            status: moveData.status
          };
        });
      }

      return moveData;
    } catch (err: unknown) {
      console.error("이동 오류:", err);
      setError(
        typeof err === "object" && err !== null && "detail" in err
          ? (err.detail as string)
          : "이동 중 오류가 발생했습니다."
      );
      return null;
    } finally {
      if (isImportantMove) {
        setLoading(false);
      }
    }
  }, [currentGame, gameStatus, isPaused, setLoading, setError, setGameStatus]);

  // 자동 하강 타이머
  useEffect(() => {
    if (!currentGame || !gameStatus || gameStatus.status !== 'ongoing' || isPaused) {
      return;
    }

    // 레벨에 따른 하강 속도 계산 (레벨이 높을수록 빠름)
    const dropSpeed = Math.max(100, 1000 - (gameStatus.level - 1) * 100);

    const intervalId = setInterval(() => {
      moveBlock(TetrisMoveType.DOWN).catch(console.error);
    }, dropSpeed);

    return () => clearInterval(intervalId);
  }, [currentGame, gameStatus, isPaused, moveBlock]);

  // 키보드 이벤트 처리
  useEffect(() => {
    if (!currentGame || !gameStatus || gameStatus.status !== 'ongoing' || isPaused) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (keyMappings[e.key]) {
        e.preventDefault();
        moveBlock(keyMappings[e.key]).catch(console.error);
      } else if (e.key === 'p' || e.key === 'P') {
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGame, gameStatus, isPaused, moveBlock, togglePause]);

  // 새 게임 생성
  const createGame = async (
    options: { width?: number; height?: number; level?: number } = {}
  ): Promise<CreateTetrisGameResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const gameData = await createTetrisGame(options);
      setCurrentGame({
        id: gameData.game_id,
        width: gameData.width,
        height: gameData.height,
        level: gameData.level
      });

      // 새 게임의 초기 상태 조회
      const statusData = await getTetrisGameStatus(gameData.game_id);
      setGameStatus(statusData);
      setIsPaused(false);

      return gameData;
    } catch (err: unknown) {
      console.error("게임 생성 오류:", err);
      
      // 인증 오류인 경우 (401)
      if (typeof err === "object" && err !== null) {
        if ("status" in err && err.status === 401) {
          setError("로그인하지 않아도 게임을 플레이할 수 있지만, 점수를 저장하려면 로그인이 필요합니다.");
        } else if ("detail" in err) {
          setError(err.detail as string);
        } else {
          setError("게임 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
      } else {
        setError("게임 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 게임 상태 조회
  const getGameStatus = async (
    gameId?: number
  ): Promise<TetrisGameStatusResponse | null> => {
    const id = gameId || (currentGame ? currentGame.id : null);
    if (!id) {
      setError("게임 ID가 필요합니다.");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const statusData = await getTetrisGameStatus(id);
      
      // 이전 상태의 홀드 정보 유지
      if (gameStatus?.held_piece && !statusData.held_piece) {
        statusData.held_piece = gameStatus.held_piece;
        
        // 홀드 사용 가능 여부도 유지
        if (gameStatus.can_hold !== undefined) {
          statusData.can_hold = gameStatus.can_hold;
        }
      }
      
      setGameStatus(statusData);
      
      // 현재 게임이 아닌 다른 게임 조회 시 현재 게임 업데이트
      if (gameId && (!currentGame || currentGame.id !== gameId)) {
        setCurrentGame({
          id: gameId,
          width: 10, // 기본값
          height: 20, // 기본값
          level: statusData.level
        });
      }
      
      // 일시정지 상태 업데이트
      setIsPaused(statusData.status === 'paused');

      return statusData;
    } catch (err: unknown) {
      console.error("게임 상태 조회 오류:", err);
      setError(
        typeof err === "object" && err !== null && "detail" in err
          ? (err.detail as string)
          : "게임 상태 조회 중 오류가 발생했습니다."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 게임 포기
  const forfeit = async (): Promise<void> => {
    if (!currentGame) {
      setError("게임이 시작되지 않았습니다.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await forfeitTetrisGame(currentGame.id);

      // 게임 상태 업데이트
      const statusData = await getTetrisGameStatus(currentGame.id);
      setGameStatus(statusData);
      setIsPaused(false);
    } catch (err: unknown) {
      console.error("게임 포기 오류:", err);
      setError(
        typeof err === "object" && err !== null && "detail" in err
          ? (err.detail as string)
          : "게임 포기 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 현재 게임 리셋
  const resetGame = () => {
    setCurrentGame(null);
    setGameStatus(null);
    setError(null);
    setIsPaused(false);
  };

  // 공개할 컨텍스트 값
  const value: TetrisContextType = {
    currentGame,
    gameStatus,
    loading,
    error,
    createGame,
    makeMove: moveBlock,
    getGameStatus,
    pauseGame: togglePause,
    forfeitGame: forfeit,
    resetGame,
    hasActiveGame: !!currentGame && (gameStatus?.status === 'ongoing' || gameStatus?.status === 'paused'),
    isPaused
  };

  return <TetrisContext.Provider value={value}>{children}</TetrisContext.Provider>;
};

// 커스텀 훅으로 컨텍스트 사용 간편화
export const useTetris = (): TetrisContextType => {
  const context = useContext(TetrisContext);
  if (!context) {
    throw new Error("useTetris는 TetrisProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};

export default TetrisContext;