import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

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
    <div className="create-game-container bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">새 게임 만들기</h2>
      
      {error && <ErrorMessage message={error} />}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="digits" className="block text-gray-700 mb-2">자릿수 선택</label>
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
            난이도: {digits === 3 ? '쉬움' : digits === 4 ? '보통' : '어려움'}
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-all duration-200 font-bold text-lg shadow-lg"
        >
          {loading ? <LoadingSpinner size="small" message="" /> : '게임 시작'}
        </button>
      </form>
    </div>
  );
};

export default CreateGame;