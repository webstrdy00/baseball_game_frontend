import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GamePage from './pages/GamePage';
import TetrisPage from './pages/TetrisPage';
import TetrisLeaderboardPage from './pages/TetrisLeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { TetrisProvider } from './context/TetrisContext';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <TetrisProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
              <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
              <Route path="/signup" element={<MainLayout><SignupPage /></MainLayout>} />
              <Route path="/game" element={<MainLayout><GamePage /></MainLayout>} />
              <Route path="/game/:gameId" element={<MainLayout><GamePage /></MainLayout>} />
              <Route path="/tetris" element={<MainLayout><TetrisPage /></MainLayout>} />
              <Route path="/tetris/:gameId" element={<MainLayout><TetrisPage /></MainLayout>} />
              <Route path="/tetris/leaderboard" element={<MainLayout><TetrisLeaderboardPage /></MainLayout>} />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <MainLayout><ProfilePage /></MainLayout>
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
            </Routes>
          </Router>
        </TetrisProvider>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;