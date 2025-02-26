import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className = '', children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? <LoadingSpinner size="small" message="" /> : (children || '로그아웃')}
    </button>
  );
};

export default LogoutButton;