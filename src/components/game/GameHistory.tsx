import React from 'react';
import { GuessHistory } from '../../types/models';

interface GameHistoryProps {
  history: GuessHistory[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="game-history-container mb-6">
        <h3 className="text-lg font-bold mb-2">게임 기록</h3>
        <p className="text-gray-500">아직 추측한 기록이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="game-history-container mb-6">
      <h3 className="text-lg font-bold mb-2">게임 기록</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">시도</th>
              <th className="p-2 border text-left">추측</th>
              <th className="p-2 border text-center">스트라이크</th>
              <th className="p-2 border text-center">볼</th>
              <th className="p-2 border text-left">결과</th>
            </tr>
          </thead>
          <tbody>
            {history.map((guess, index) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameHistory;