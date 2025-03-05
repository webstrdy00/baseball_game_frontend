import React from 'react';
import TetrisLeaderboard from '../components/tetris/TetrisLeaderboard';
import styles from './TetrisLeaderboardPage.module.css';

const TetrisLeaderboardPage: React.FC = () => {
  return (
    <div className={styles.leaderboardPageContainer}>
      <h1 className={styles.pageTitle}>테트리스 리더보드</h1>
      <TetrisLeaderboard />
    </div>
  );
};

export default TetrisLeaderboardPage;