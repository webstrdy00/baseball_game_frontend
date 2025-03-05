import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

interface GuessFormProps {
  gameId: number;
  digits: number;
  disabled: boolean;
}

const GuessForm: React.FC<GuessFormProps> = ({ gameId, digits, disabled }) => {
  const [guess, setGuess] = useState<string>('');
  const [guessError, setGuessError] = useState<string | null>(null);
  const { makeGuess, loading, error } = useGame();
  
  // 게임 ID가 변경될 때 입력 필드 초기화
  useEffect(() => {
    setGuess('');
    setGuessError(null);
  }, [gameId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력 가능하도록 처리
    const { value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      setGuess(value);
    }
  };

  const validateGuess = (): boolean => {
    // 숫자만 입력 가능
    if (!/^\d+$/.test(guess)) {
      setGuessError('숫자만 입력 가능합니다.');
      return false;
    }
    
    // 자릿수 확인
    if (guess.length !== digits) {
      setGuessError(`${digits}자리 숫자를 입력해주세요.`);
      return false;
    }
    
    // 중복된 숫자 확인
    const uniqueDigits = new Set(guess.split('')).size;
    if (uniqueDigits !== digits) {
      setGuessError('중복되지 않는 숫자를 입력해주세요.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (disabled || loading) {
      return;
    }
    
    setGuessError(null);
    
    if (!validateGuess()) {
      return;
    }
    
    await makeGuess(guess);
    setGuess(''); // 제출 후 입력 필드 초기화
  };

  return (
    <div className="guess-form-container mb-6">
      <h3 className="text-lg font-bold mb-2">숫자 추측</h3>
      
      {guessError && <ErrorMessage message={guessError} />}
      {error && <ErrorMessage message={error} />}
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={guess}
          onChange={handleChange}
          disabled={disabled || loading}
          placeholder={`${digits}자리 숫자 입력 (예: ${Array(digits).fill(0).map((_, i) => i).join('')})`}
          maxLength={digits}
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          type="submit"
          disabled={disabled || loading || !guess}
          className="px-6 py-2 bg-blue-200 text-black font-semibold rounded-lg hover:bg-blue-300 transition-all duration-200 disabled:bg-blue-100 disabled:text-gray-600"
        >
          {loading ? <LoadingSpinner size="small" message="" /> : '제출'}
        </button>
      </form>
      
      {disabled && (
        <p className="mt-2 text-gray-500 text-sm">게임이 종료되었습니다.</p>
      )}
    </div>
  );
};

export default GuessForm;