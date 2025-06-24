import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTetrisLeaderboard, getUserHighScores } from '../../api/tetris';
import { TetrisHighScoreItem } from '../../types/models';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import styles from './TetrisLeaderboard.module.css';
import { useAuth } from '../../context/AuthContext';
import logger from '../../utils/logger';

const TetrisLeaderboard: React.FC = () => {
  const [globalScores, setGlobalScores] = useState<TetrisHighScoreItem[]>([]);
  const [userScores, setUserScores] = useState<TetrisHighScoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'global' | 'user'>('global');
  const [authError, setAuthError] = useState<boolean>(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 전체 리더보드 조회
        const globalData = await getTetrisLeaderboard(10);
        setGlobalScores(globalData.scores);
        
        // 사용자 최고 점수 조회 (로그인된 경우)
        if (isAuthenticated) {
          try {
            const userData = await getUserHighScores(5);
            setUserScores(userData.scores);
            
            // 사용자 점수가 있으면 기본 탭을 사용자 점수로 변경
            if (userData.scores.length > 0) {
              setActiveTab('user');
            }
          } catch (err: unknown) {
            logger.log('사용자 최고 점수 조회 실패:', err);
            
            // 타입 가드를 사용하여 err 객체의 구조 확인
            if (
              typeof err === 'object' && 
              err !== null && 
              ('status' in err || 'message' in err)
            ) {
              // 401 에러인 경우 인증 오류 상태 설정
              if (
                ('status' in err && err.status === 401) || 
                ('message' in err && typeof err.message === 'string' && err.message.includes('인증'))
              ) {
                setAuthError(true);
                
                // 페이지 이동이 필요하면 여기서 실행
                navigate('/login', { 
                  state: { 
                    from: '/tetris/leaderboard', 
                    message: '개인 점수를 보려면 로그인이 필요합니다.' 
                  } 
                });
              }
            }
          }
        }
      } catch (err: unknown) {
        logger.error("리더보드 조회 오류:", err);
        setError(
          typeof err === "object" && err !== null && "detail" in err
            ? (err.detail as string)
            : "리더보드를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [isAuthenticated, navigate]);
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };
  
  // 게임 시간 포맷팅 함수
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds}초`;
  };
  
  // 로그인 상태 체크 (authError가 true이면 이미 리다이렉트 중)
  if (authError) {
    return null;
  }
  
  if (loading) {
    return <LoadingSpinner message="리더보드를 불러오는 중..." />;
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  const displayScores = activeTab === 'global' ? globalScores : userScores;
  
  return (
    <div className={styles.leaderboardContainer}>
      <h2 className={styles.leaderboardTitle}>테트리스 리더보드</h2>
      
      <div className={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('global')}
          className={`${styles.tabButton} ${activeTab === 'global' ? styles.activeTab : ''}`}
        >
          전체 순위
        </button>
        <button
          onClick={() => {
            // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
            if (!isAuthenticated) {
              navigate('/login', { 
                state: { 
                  from: '/tetris/leaderboard', 
                  message: '개인 점수를 보려면 로그인이 필요합니다.' 
                } 
              });
              return;
            }
            
            // 로그인 상태면 탭 변경
            setActiveTab('user');
          }}
          className={`${styles.tabButton} ${activeTab === 'user' ? styles.activeTab : ''}`}
          disabled={!isAuthenticated || userScores.length === 0}
        >
          내 최고 점수
        </button>
      </div>
      
      {displayScores.length === 0 ? (
        <div className={styles.emptyLeaderboard}>
          <p>
            {activeTab === 'global'
              ? '아직 기록된 점수가 없습니다.'
              : '아직 기록된 점수가 없습니다. 게임을 플레이하여 점수를 기록해보세요.'}
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link to="/tetris" className={styles.playButton}>
              게임 시작하기
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/login" 
                state={{ 
                  from: '/tetris/leaderboard', 
                  message: '개인 점수를 보려면 로그인이 필요합니다.'
                }}
                className={`${styles.playButton} ${styles.loginButton}`}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <table className={styles.leaderboardTable}>
            <thead>
              <tr>
                <th>순위</th>
                <th>사용자</th>
                <th>점수</th>
                <th>레벨</th>
                <th>라인 수</th>
                <th>게임 시간</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody>
              {displayScores.map((score, index) => (
                <tr key={index} className={index === 0 ? styles.topScore : ''}>
                  <td>{index + 1}</td>
                  <td>{score.username}</td>
                  <td className={styles.scoreCell}>{score.score}</td>
                  <td>{score.level}</td>
                  <td>{score.lines_cleared}</td>
                  <td>{formatDuration(score.game_duration)}</td>
                  <td>{formatDate(score.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className={styles.leaderboardFooter}>
            <div className="flex justify-center space-x-4">
              <Link to="/tetris" className={styles.playButton}>
                게임 플레이
              </Link>
              {!isAuthenticated && (
                <Link 
                  to="/login" 
                  state={{ 
                    from: '/tetris/leaderboard', 
                    message: '개인 점수를 보려면 로그인이 필요합니다.'
                  }}
                  className={`${styles.playButton} ${styles.loginButton}`}
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TetrisLeaderboard;