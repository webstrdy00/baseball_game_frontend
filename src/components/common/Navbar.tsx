import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../auth/LogoutButton';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">숫자야구</Link>
        
        <div className="navbar-links">
          <Link to="/" className="navbar-link">홈</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/game" className="navbar-link">새 게임</Link>
              <Link to="/profile" className="navbar-link">프로필 ({user?.username})</Link>
              <LogoutButton className="navbar-button" />
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">로그인</Link>
              <Link to="/signup" className="navbar-link">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
