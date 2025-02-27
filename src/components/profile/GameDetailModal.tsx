import React from "react";
import { GameDetailHistoryResponse, GuessHistory } from "../../types/models";
import LoadingSpinner from "../common/LoadingSpinner";

interface GameDetailModalProps {
  gameDetail: GameDetailHistoryResponse | null;
  loading: boolean;
  onClose: () => void;
}

const GameDetailModal: React.FC<GameDetailModalProps> = ({
  gameDetail,
  loading,
  onClose,
}) => {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-lg w-full">
          <LoadingSpinner message="게임 상세 정보를 불러오는 중..." />
        </div>
      </div>
    );
  }

  if (!gameDetail) {
    return null;
  }

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

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            게임 #{gameDetail.game_id} 상세 정보
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">자릿수</p>
            <p className="font-medium">{gameDetail.digits}자리</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">상태</p>
            <p className="font-medium">{getStatusText(gameDetail.status)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">시도 횟수</p>
            <p className="font-medium">{gameDetail.attempts_used}회</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">생성 일시</p>
            <p className="font-medium">{formatDate(gameDetail.created_at)}</p>
          </div>
        </div>

        {gameDetail.status !== "ongoing" && (
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-500">정답</p>
            <p className="font-mono text-xl font-bold">{gameDetail.answer}</p>
          </div>
        )}

        <h3 className="text-lg font-semibold mb-2">추측 기록</h3>

        {gameDetail.guesses.length === 0 ? (
          <p className="text-gray-500">추측 기록이 없습니다.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-left">번호</th>
                <th className="p-2 border text-left">추측</th>
                <th className="p-2 border text-center">스트라이크</th>
                <th className="p-2 border text-center">볼</th>
                <th className="p-2 border text-left">결과</th>
                <th className="p-2 border text-left">시간</th>
              </tr>
            </thead>
            <tbody>
              {gameDetail.guesses.map((guess, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border font-mono">{guess.guess}</td>
                  <td className="p-2 border text-center">{guess.strike}</td>
                  <td className="p-2 border text-center">{guess.ball}</td>
                  <td className="p-2 border">
                    {guess.strike === 0 && guess.ball === 0 ? (
                      <span className="text-red-500">아웃</span>
                    ) : (
                      `${guess.strike}S ${guess.ball}B`
                    )}
                  </td>
                  <td className="p-2 border text-sm">
                    {formatDate(guess.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameDetailModal;
