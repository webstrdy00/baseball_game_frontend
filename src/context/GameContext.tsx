import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  createGame as apiCreateGame,
  makeGuess as apiMakeGuess,
  getGameStatus as apiGetGameStatus,
  forfeitGame as apiForfeitGame,
} from "../api/game";
import {
  CreateGameResponse,
  GameStatusResponse,
  GuessResponse,
} from "../types/models";
import logger from "../utils/logger";

// 현재 게임 정보 타입
interface CurrentGame {
  id: number;
  digits: number;
  message?: string;
}

// 게임 컨텍스트 타입 정의
interface GameContextType {
  currentGame: CurrentGame | null;
  gameStatus: GameStatusResponse | null;
  loading: boolean;
  error: string | null;
  createGame: (digits?: number) => Promise<CreateGameResponse | null>;
  makeGuess: (guess: string) => Promise<GuessResponse | null>;
  getGameStatus: (gameId?: number) => Promise<GameStatusResponse | null>;
  forfeitGame: () => Promise<void>;
  resetGame: () => void;
  hasActiveGame: boolean;
}

// 기본값 생성
const defaultGameContext: GameContextType = {
  currentGame: null,
  gameStatus: null,
  loading: false,
  error: null,
  createGame: async () => null,
  makeGuess: async () => null,
  getGameStatus: async () => null,
  forfeitGame: async () => {},
  resetGame: () => {},
  hasActiveGame: false,
};

// 컨텍스트 생성
const GameContext = createContext<GameContextType>(defaultGameContext);

// Provider props 타입 정의
interface GameProviderProps {
  children: ReactNode;
}

// GameProvider 컴포넌트
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [currentGame, setCurrentGame] = useState<CurrentGame | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 새 게임 생성
  const createGame = async (
    digits: number = 3
  ): Promise<CreateGameResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const gameData = await apiCreateGame(digits);
      setCurrentGame({
        id: gameData.game_id,
        digits,
        message: gameData.message,
      });

      // 새 게임의 초기 상태 조회
      const statusData = await apiGetGameStatus(gameData.game_id);
      setGameStatus(statusData);

      return gameData;
    } catch (err: unknown) {
      logger.error("게임 생성 오류:", err);
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

  // 숫자 추측
  const makeGuess = async (guess: string): Promise<GuessResponse | null> => {
    if (!currentGame) {
      setError("게임이 시작되지 않았습니다.");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const guessData = await apiMakeGuess(currentGame.id, guess);

      // 게임 상태 업데이트
      const statusData = await apiGetGameStatus(currentGame.id);
      setGameStatus(statusData);

      return guessData;
    } catch (err: unknown) {
      logger.error("추측 오류:", err);
      setError(
        typeof err === "object" && err !== null && "detail" in err
          ? (err.detail as string)
          : "추측 중 오류가 발생했습니다."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 게임 상태 조회
  const getGameStatus = async (
    gameId?: number
  ): Promise<GameStatusResponse | null> => {
    const id = gameId || (currentGame ? currentGame.id : null);
    if (!id) {
      setError("게임 ID가 필요합니다.");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const statusData = await apiGetGameStatus(id);
      setGameStatus(statusData);

      // 현재 게임이 아닌 다른 게임 조회 시 현재 게임 업데이트
      if (gameId && (!currentGame || currentGame.id !== gameId)) {
        setCurrentGame({
          id: gameId,
          digits: 3, // 기본값, API 응답에서 이 정보를 가져올 수 있다면 더 좋을 것
        });
      }

      return statusData;
    } catch (err: unknown) {
      logger.error("게임 상태 조회 오류:", err);
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
  const forfeitGame = async (): Promise<void> => {
    if (!currentGame) {
      setError("게임이 시작되지 않았습니다.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await apiForfeitGame(currentGame.id);

      // 게임 상태 업데이트
      const statusData = await apiGetGameStatus(currentGame.id);
      setGameStatus(statusData);
    } catch (err: unknown) {
      logger.error("게임 포기 오류:", err);
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
  };

  // 공개할 컨텍스트 값
  const value: GameContextType = {
    currentGame,
    gameStatus,
    loading,
    error,
    createGame,
    makeGuess,
    getGameStatus,
    forfeitGame,
    resetGame,
    hasActiveGame: !!currentGame && gameStatus?.status === "ongoing",
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// 커스텀 훅으로 컨텍스트 사용 간편화
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame은 GameProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};

export default GameContext;
