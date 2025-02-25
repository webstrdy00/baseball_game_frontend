import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          숫자야구
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            홈
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/game" className="navbar-link">
                새 게임
              </Link>
              <Link to="/profile" className="navbar-link">
                프로필 ({user?.username})
              </Link>
              <button onClick={handleLogout} className="navbar-button">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                로그인
              </Link>
              <Link to="/signup" className="navbar-link">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
