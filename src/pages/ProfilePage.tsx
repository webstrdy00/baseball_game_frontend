import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserGameHistory, getGameDetailHistory } from "../api/auth";
import UserProfileSummary from "../components/profile/UserProfileSummary";
import GameHistoryList from "../components/profile/GameHistoryList";
import GameDetailModal from "../components/profile/GameDetailModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import GameStatistics from "../components/profile/GameStatistics";
import EmptyGameHistory from "../components/profile/EmptyGameHistory";
import {
  GameDetailHistoryResponse,
  UserGameHistoryResponse,
} from "../types/models";
import logger from "../utils/logger";

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [userHistory, setUserHistory] =
    useState<UserGameHistoryResponse | null>(null);
  const [selectedGameDetail, setSelectedGameDetail] =
    useState<GameDetailHistoryResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // 사용자 게임 히스토리 불러오기
  useEffect(() => {
    const fetchUserHistory = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const historyData = await getUserGameHistory();
        setUserHistory(historyData);
      } catch (err: unknown) {
        logger.error("게임 히스토리 조회 오류:", err);
        setError(
          typeof err === "object" && err !== null && "detail" in err
            ? (err.detail as string)
            : "게임 히스토리를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, [isAuthenticated, navigate]);

  // 게임 상세 정보 불러오기
  const handleViewGameDetail = async (gameId: number) => {
    setDetailLoading(true);
    setSelectedGameDetail(null);
    setShowDetailModal(true);

    try {
      const detailData = await getGameDetailHistory(gameId);
      setSelectedGameDetail(detailData);
    } catch (err: unknown) {
      logger.error("게임 상세 정보 조회 오류:", err);
      setError(
        typeof err === "object" && err !== null && "detail" in err
          ? (err.detail as string)
          : "게임 상세 정보를 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowDetailModal(false);
  };

  if (loading) {
    return <LoadingSpinner message="게임 히스토리를 불러오는 중..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!user || !userHistory) {
    return <div>사용자 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">내 프로필</h1>
      <UserProfileSummary user={user} totalGames={userHistory.total_games} />

      {/* 게임 통계 컴포넌트 추가 - 게임이 있을 때만 표시 */}
      {userHistory.total_games > 0 && (
        <GameStatistics games={userHistory.games} />
      )}

      <h2 className="text-2xl font-bold mb-4">게임 히스토리</h2>

      {/* 게임 히스토리 리스트 또는 빈 히스토리 컴포넌트 조건부 렌더링 */}
      {userHistory.total_games > 0 ? (
        <GameHistoryList
          games={userHistory.games}
          onViewDetail={handleViewGameDetail}
        />
      ) : (
        <EmptyGameHistory />
      )}

      {showDetailModal && (
        <GameDetailModal
          gameDetail={selectedGameDetail}
          loading={detailLoading}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProfilePage;
