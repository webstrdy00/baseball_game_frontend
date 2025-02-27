import React, { useMemo } from "react";
import { GameHistoryItem } from "../../types/models";

interface GameStatisticsProps {
  games: GameHistoryItem[];
}

const GameStatistics: React.FC<GameStatisticsProps> = ({ games }) => {
  const stats = useMemo(() => {
    // 기본 통계 값 초기화
    const statistics = {
      totalGames: games.length,
      wins: 0,
      losses: 0,
      forfeits: 0,
      ongoing: 0,
      winRate: 0,
      avgAttempts: 0,
      totalAttempts: 0,
      bestGame: null as GameHistoryItem | null,
      worstGame: null as GameHistoryItem | null,
    };

    // 통계 계산
    games.forEach((game) => {
      switch (game.status) {
        case "win":
          statistics.wins++;

          // 가장 적은 시도로 이긴 게임 찾기 (bestGame)
          if (
            !statistics.bestGame ||
            game.attempts_used < statistics.bestGame.attempts_used
          ) {
            statistics.bestGame = game;
          }
          break;
        case "lose":
          statistics.losses++;

          // 가장 많은 시도를 한 게임 찾기 (worstGame)
          if (
            !statistics.worstGame ||
            game.attempts_used > statistics.worstGame.attempts_used
          ) {
            statistics.worstGame = game;
          }
          break;
        case "forfeited":
          statistics.forfeits++;
          break;
        case "ongoing":
          statistics.ongoing++;
          break;
      }

      // 총 시도 횟수 누적
      statistics.totalAttempts += game.attempts_used;
    });

    // 완료된 게임 수 (진행 중인 게임 제외)
    const completedGames = statistics.totalGames - statistics.ongoing;

    // 승률 계산 (완료된 게임 중)
    if (completedGames > 0) {
      statistics.winRate = (statistics.wins / completedGames) * 100;
    }

    // 평균 시도 횟수 계산 (승리한 게임만)
    if (statistics.wins > 0) {
      const winningGames = games.filter((game) => game.status === "win");
      const winningAttempts = winningGames.reduce(
        (sum, game) => sum + game.attempts_used,
        0
      );
      statistics.avgAttempts = winningAttempts / statistics.wins;
    }

    return statistics;
  }, [games]);

  if (games.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold mb-4">게임 통계</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-500">총 게임</p>
          <p className="text-2xl font-bold">{stats.totalGames}게임</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-500">승리</p>
          <p className="text-2xl font-bold">{stats.wins}게임</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-500">패배</p>
          <p className="text-2xl font-bold">{stats.losses}게임</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">승률</p>
          <p className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">평균 시도 횟수 (승리)</p>
          <p className="text-2xl font-bold">{stats.avgAttempts.toFixed(1)}회</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">진행 중인 게임</p>
          <p className="text-2xl font-bold">{stats.ongoing}게임</p>
        </div>
      </div>

      {stats.bestGame && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-500">최고의 게임</p>
          <p className="font-medium">
            게임 #{stats.bestGame.game_id}: {stats.bestGame.attempts_used}번
            시도로 승리 (
            {new Date(stats.bestGame.created_at).toLocaleDateString()})
          </p>
        </div>
      )}
    </div>
  );
};

export default GameStatistics;
