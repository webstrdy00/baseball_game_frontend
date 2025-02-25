import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  // 로그인 상태는 나중에 Context에서 관리할 예정
  const isLoggedIn = false;
  
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">숫자야구</Link>
        
        <div className="navbar-links">
          <Link to="/" className="navbar-link">홈</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/game" className="navbar-link">새 게임</Link>
              <Link to="/profile" className="navbar-link">프로필</Link>
              <button className="navbar-button">로그아웃</button>
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