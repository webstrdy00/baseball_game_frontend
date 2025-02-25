import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';

const NotFoundPage = () => (
  <MainLayout>
    <div className="container">
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
    </div>
  </MainLayout>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><SignupPage /></MainLayout>} />
        <Route path="/game/:gameId?" element={<MainLayout><GamePage /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;