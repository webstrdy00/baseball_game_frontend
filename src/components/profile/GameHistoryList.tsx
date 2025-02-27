import React from "react";
import { Link } from "react-router-dom";
import { GameHistoryItem } from "../../types/models";

interface GameHistoryListProps {
  games: GameHistoryItem[];
  onViewDetail: (gameId: number) => void;
}

const GameHistoryList: React.FC<GameHistoryListProps> = ({
  games,
  onViewDetail,
}) => {
  if (games.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">아직 플레이한 게임이 없습니다.</p>
        <Link
          to="/game"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          새 게임 시작하기
        </Link>
      </div>
    );
  }

  // 게임 상태에 따른 배지 색상 결정
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "win":
        return "bg-green-100 text-green-800 border-green-200";
      case "lose":
        return "bg-red-100 text-red-800 border-red-200";
      case "forfeited":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // 게임 상태 한글로 변환
  const getStatusText = (status: string) => {
    switch (status) {
      case "win":
        return "승리";
      case "lose":
        return "패배";
      case "forfeited":
        return "포기";
      case "ongoing":
        return "진행 중";
      default:
        return status;
    }
  };

  return (
    <div className="overflow-hidden">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">게임 #</th>
            <th className="py-3 px-4 text-left">자릿수</th>
            <th className="py-3 px-4 text-left">상태</th>
            <th className="py-3 px-4 text-left">시도 횟수</th>
            <th className="py-3 px-4 text-left">마지막 시도</th>
            <th className="py-3 px-4 text-left">생성 일시</th>
            <th className="py-3 px-4 text-center">액션</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {games.map((game) => (
            <tr key={game.game_id} className="hover:bg-gray-50">
              <td className="py-3 px-4">{game.game_id}</td>
              <td className="py-3 px-4">{game.digits}자리</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    game.status
                  )}`}
                >
                  {getStatusText(game.status)}
                </span>
              </td>
              <td className="py-3 px-4">{game.attempts_used}회</td>
              <td className="py-3 px-4">
                {game.last_guess ? (
                  <div>
                    <div className="font-mono">{game.last_guess}</div>
                    <div className="text-xs text-gray-500">
                      {game.last_guess_time
                        ? formatDate(game.last_guess_time)
                        : ""}
                    </div>
                  </div>
                ) : (
                  "없음"
                )}
              </td>
              <td className="py-3 px-4">{formatDate(game.created_at)}</td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onViewDetail(game.game_id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  상세보기
                </button>
                {game.status === "ongoing" && (
                  <Link
                    to={`/game/${game.game_id}`}
                    className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    계속하기
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameHistoryList;
