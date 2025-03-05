import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTetris } from '../context/TetrisContext';
import CreateTetrisGame from '../components/tetris/CreateTetrisGame';
import TetrisGame from '../components/tetris/TetrisGame';
import { useAuth } from '../context/AuthContext';
import styles from './TetrisPage.module.css';

const TetrisPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { currentGame } = useTetris();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // 이미 진행 중인 게임이 있지만 다른 게임 페이지로 접근한 경우
  useEffect(() => {
    if (currentGame && gameId && parseInt(gameId, 10) !== currentGame.id) {
      if (window.confirm('이미 진행 중인 게임이 있습니다. 해당 게임으로 이동하시겠습니까?')) {
        navigate(`/tetris/${currentGame.id}`);
      }
    }
  }, [currentGame, gameId, navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>🧱 테트리스</h1>
      {gameId ? (
        <TetrisGame gameId={parseInt(gameId, 10)} />
      ) : (
        <>
          {!isAuthenticated && (
            <div className={styles.loginNotice}>
              <p>게임 점수를 기록하려면 <button onClick={() => navigate('/login')} className={styles.loginLink}>로그인</button>이 필요합니다. 로그인 없이도 게임을 플레이할 수 있습니다.</p>
            </div>
          )}
          <CreateTetrisGame />
          
          <div className={styles.gameInstructions}>
            <h2 className={styles.instructionsTitle}>게임 방법</h2>
            <ol className={styles.instructionsList}>
              <li>게임을 시작하려면 <strong>새 게임</strong> 버튼을 클릭하세요.</li>
              <li>블록을 좌우로 이동하고 회전시켜 가로줄을 완성하세요.</li>
              <li>한 줄이 완성되면 해당 줄이 사라지고 점수를 얻습니다.</li>
              <li>더 많은 줄을 한 번에 없앨수록 더 높은 점수를 얻습니다.</li>
              <li>일정 점수에 도달하면 레벨이 올라가고 블록이 더 빨리 떨어집니다.</li>
              <li>블록이 화면 상단에 닿으면 게임이 종료됩니다.</li>
            </ol>
            
            <div className={styles.controlsInfo}>
              <h3>조작 방법</h3>
              <ul className={styles.instructionsList}>
                <li><strong>←, →</strong>: 블록을 좌우로 이동</li>
                <li><strong>↓</strong>: 블록을 아래로 이동 (소프트 드롭)</li>
                <li><strong>↻</strong>: 블록 회전</li>
                <li><strong>⤓</strong>: 하드 드롭 (블록을 바닥까지 즉시 떨어뜨림)</li>
                <li><strong>H</strong>: 현재 블록 홀드 (보관)</li>
                <li><strong>일시정지/재개</strong>: 게임 일시정지 또는 재개</li>
                <li><strong>재시작</strong>: 게임 재시작</li>
              </ul>
            </div>
            
            <div className={styles.example}>
              <p>예시: 블록을 쌓아 가로줄을 완성하면 해당 줄이 사라지고 점수를 얻습니다. 레벨이 올라갈수록 블록이 더 빨리 떨어져 난이도가 증가합니다.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TetrisPage;