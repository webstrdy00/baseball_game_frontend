import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginCredentials } from '../../types/models';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 성공 후 이동할 경로
  const from = (location.state as any)?.from?.pathname || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    
    // 폼 유효성 검사
    if (!credentials.email.trim() || !credentials.password) {
      setFormError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    try {
      const user = await login(credentials);
      if (user) {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setFormError(err.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-form-container max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
      
      {formError && <ErrorMessage message={formError} />}
      {error && <ErrorMessage message={error} />}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">이메일</label>
          <input
            type="text"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="이메일을 입력하세요"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            disabled={loading}
            placeholder="비밀번호를 입력하세요"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" message="" /> : '로그인'}
          </button>
        </div>
      </form>
      
      <div className="text-center text-gray-600">
        <p>
          계정이 없으신가요? <a href="/signup" className="text-blue-500 hover:underline">회원가입</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;