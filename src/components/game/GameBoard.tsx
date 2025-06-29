import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { useAuth } from "../../context/AuthContext";
import { getGameDetailHistory } from "../../api/auth";
import GuessForm from "./GuessForm";
import GameHistory from "./GameHistory";
import GameStatus from "./GameStatus";
import GameResultModal from "./GameResultModal";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import logger from "../../utils/logger";

interface GameBoardProps {
  gameId: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameId }) => {
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [gameAnswer, setGameAnswer] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const { getGameStatus, gameStatus, loading, error, forfeitGame, resetGame } =
    useGame();
  const { isAuthenticated } = useAuth();
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

  // 게임 상태가 변경되었을 때 모달 표시 및 로그인 상태면 게임 상세 정보 가져오기
  useEffect(() => {
    if (gameStatus && gameStatus.status !== "ongoing") {
      setShowResultModal(true);

      // 게임 상태에서 직접 정답 가져오기
      if (gameStatus.answer) {
        setGameAnswer(gameStatus.answer);
      }
      // 정답이 없는 경우에만 API 호출
      else if (isAuthenticated) {
        const fetchGameDetail = async () => {
          try {
            const detailData = await getGameDetailHistory(gameId);
            if (detailData.answer) {
              setGameAnswer(detailData.answer);
            }
          } catch (error) {
            logger.error("게임 상세 정보 조회 실패:", error);
          }
        };

        fetchGameDetail();
      }
    }
  }, [gameStatus, gameId, isAuthenticated]);

  const handleForfeit = async () => {
    if (window.confirm("정말로 게임을 포기하시겠습니까?")) {
      await forfeitGame();
    }
  };

  const handleNewGame = () => {
    resetGame();
    navigate("/game");
  };

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

  return (
    <div className="game-board-container">
      <h2 className="text-2xl font-bold mb-4">
        숫자야구게임
        <span className="ml-2 text-sm font-normal text-gray-500">
          {gameStatus.status === "ongoing" ? "(진행 중)" : "(종료됨)"}
        </span>
      </h2>

      <GameStatus
        gameStatus={gameStatus}
        onForfeit={handleForfeit}
        onNewGame={handleNewGame}
      />

      <GuessForm
        gameId={gameId}
        digits={gameStatus.digits || 3}
        disabled={gameStatus.status !== "ongoing"}
      />

      <GameHistory history={gameStatus.history} />

      {showResultModal && gameStatus.status !== "ongoing" && (
        <GameResultModal
          status={gameStatus.status as "win" | "lose" | "forfeited"}
          attempts={gameStatus.attempts_used}
          answer={gameAnswer || "알 수 없음"}
          onClose={() => setShowResultModal(false)}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
};

export default GameBoard;
