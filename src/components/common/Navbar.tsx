import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../auth/LogoutButton';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600">⚾</span>
              <span className="text-xl font-bold text-gray-800">숫자야구</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-sm font-medium">
              홈
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/game" className="px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-sm font-medium">
                  새 게임
                </Link>
                <Link to="/profile" className="px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md text-sm font-medium">
                  프로필
                </Link>
                <div className="ml-2 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  {user?.username}
                </div>
                <LogoutButton className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium" />
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 text-sm font-medium">
                  로그인
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium">
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              홈
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/game" 
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  새 게임
                </Link>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  프로필
                </Link>
                <div className="px-3 py-2 text-sm font-medium text-gray-700">
                  {user?.username} 님
                </div>
                <LogoutButton 
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그아웃
                </LogoutButton>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
