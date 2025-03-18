import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

const CreateGame: React.FC = () => {
  const [digits, setDigits] = useState<number>(3);
  const { createGame, loading, error } = useGame();
  const navigate = useNavigate();

  const handleDigitsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDigits(parseInt(e.target.value, 10));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gameData = await createGame(digits);
    if (gameData) {
      navigate(`/game/${gameData.game_id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-bold mb-4">새 게임 만들기</h2>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="digits" className="block text-gray-700 mb-2">
              자릿수 선택
            </label>
            <select
              id="digits"
              value={digits}
              onChange={handleDigitsChange}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={3}>3자리</option>
              <option value={4}>4자리</option>
              <option value={5}>5자리</option>
            </select>
            <p className="mt-2 text-sm text-gray-500">
              난이도: {digits === 3 ? "쉬움" : digits === 4 ? "보통" : "어려움"}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-all duration-200 font-bold text-lg"
          >
            {loading ? <LoadingSpinner size="small" message="" /> : "게임 시작"}
          </button>
        </form>
      </div>

      {/* 게임 규칙 설명 섹션 */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">게임 방법</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ol className="list-decimal list-inside space-y-4">
            <li className="pl-2">
              <span className="font-semibold">게임 시작:</span> 컴퓨터가
              중복되지 않는 3~5자리 숫자를 무작위로 생성합니다.
            </li>
            <li className="pl-2">
              <span className="font-semibold">숫자 추측:</span> 10번의 기회 동안
              정답을 맞춰야 합니다. 각 시도마다 정답과 일치하는 정도에 따라
              힌트를 얻습니다.
            </li>
            <li className="pl-2">
              <span className="font-semibold">힌트 이해:</span>
              <ul className="list-disc list-inside pl-6 mt-2 space-y-1">
                <li>
                  <span className="font-bold text-blue-600">스트라이크(S)</span>
                  : 숫자와 위치가 모두 일치
                </li>
                <li>
                  <span className="font-bold text-green-600">볼(B)</span>:
                  숫자는 있지만 위치가 다름
                </li>
                <li>
                  <span className="font-bold text-red-600">아웃</span>: 해당하는
                  숫자가 없음
                </li>
              </ul>
            </li>
            <li className="pl-2">
              <span className="font-semibold">게임 승리:</span> 정답을 맞추면
              승리! 시도 횟수가 기록됩니다.
            </li>
            <li className="pl-2">
              <span className="font-semibold">게임 종료:</span> 10번의 기회를
              모두 사용하거나 정답을 맞추면 게임이 종료됩니다.
            </li>
          </ol>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">예시</h3>
            <p className="mb-3">
              정답이 <span className="font-mono font-bold">123</span>이라면:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded mr-3 w-12 text-center">
                  456
                </span>
                <span>0 스트라이크, 0 볼 (아웃: 모든 숫자가 없음)</span>
              </li>
              <li className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded mr-3 w-12 text-center">
                  735
                </span>
                <span>0 스트라이크, 1 볼 (3이 있지만 위치가 다름)</span>
              </li>
              <li className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded mr-3 w-12 text-center">
                  321
                </span>
                <span>
                  1 스트라이크, 2 볼 (1의 위치만 같고, 2와 3은 있지만 위치가
                  다름)
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded mr-3 w-12 text-center">
                  123
                </span>
                <span>3 스트라이크, 0 볼 (정답!)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
