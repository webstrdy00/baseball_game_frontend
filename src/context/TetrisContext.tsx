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
  'C': TetrisMoveType.HOLD
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

    setLoading(true);
    setError(null);
    try {
      const moveData = await makeMove(currentGame.id, { move_type: moveType });

      // 게임 상태 업데이트
      if (moveData.status !== 'ongoing') {
        const statusData = await getTetrisGameStatus(currentGame.id);
        setGameStatus(statusData);
      } else {
        // 성능 최적화를 위해 API 응답으로 직접 상태 업데이트
        setGameStatus(prevStatus => {
          if (!prevStatus) return null;
          return {
            ...prevStatus,
            board: moveData.board,
            current_piece: moveData.current_piece,
            next_piece: moveData.next_piece,
            held_piece: moveData.held_piece,
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
      setLoading(false);
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
      setError(
        typeof err === "object" && err !== null && "detail" in err
          ? (err.detail as string)
          : "게임 생성 중 오류가 발생했습니다."
      );
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