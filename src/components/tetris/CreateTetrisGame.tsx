import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTetris } from '../../context/TetrisContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import styles from './CreateTetrisGame.module.css';

const CreateTetrisGame: React.FC = () => {
  const [level, setLevel] = useState<number>(1);
  const { createGame, loading, error } = useTetris();
  const navigate = useNavigate();
  
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(parseInt(e.target.value, 10));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gameData = await createGame({ level });
    if (gameData) {
      navigate(`/tetris/${gameData.game_id}`);
    }
  };
  
  return (
    <div className={styles.createGameContainer}>
      <h2 className={styles.createGameTitle}>새 테트리스 게임 시작</h2>
      
      {error && <ErrorMessage message={error} />}
      
      <form onSubmit={handleSubmit} className={styles.createGameForm}>
        <div className={styles.formGroup}>
          <label htmlFor="level" className={styles.formLabel}>시작 레벨</label>
          <select
            id="level"
            value={level}
            onChange={handleLevelChange}
            disabled={loading}
            className={styles.levelSelect}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                레벨 {i + 1}
              </option>
            ))}
          </select>
          <p className={styles.levelDescription}>
            레벨이 높을수록 블록이 빨리 떨어집니다.
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={styles.startButton}
        >
          {loading ? <LoadingSpinner size="small" message="" /> : '게임 시작'}
        </button>
      </form>
    </div>
  );
};

export default CreateTetrisGame;