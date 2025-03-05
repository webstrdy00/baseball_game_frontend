import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  message?: string;
  from?: string;
}

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);
  const [returnPath, setReturnPath] = useState<string>('/');

  // 로케이션 상태에서 메시지와 리다이렉트 경로 확인
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.message) {
      setMessage(state.message);
    }
    if (state?.from) {
      setReturnPath(state.from);
    }
  }, [location]);

  // 이미 로그인한 사용자는 returnPath로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnPath);
    }
  }, [isAuthenticated, navigate, returnPath]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">로그인</h1>
      
      {message && (
        <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded mb-6 max-w-md mx-auto">
          <p>{message}</p>
        </div>
      )}
      
      <LoginForm />
    </div>
  );
};

export default LoginPage;