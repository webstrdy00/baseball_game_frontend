import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../api/auth';
import { UserCreate } from '../../types/models';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<UserCreate & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('올바른 이메일 형식이 아닙니다.');
      return false;
    }
    
    // 비밀번호 길이 검사
    if (formData.password.length < 6) {
      setFormError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }
    
    // 비밀번호 일치 검사
    if (formData.password !== formData.confirmPassword) {
      setFormError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      // 비밀번호 확인은 API로 전송하지 않음
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      
      setSignupSuccess(true);
      
      // 3초 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setFormError(error.detail || '회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="signup-success bg-green-100 border border-green-300 text-green-700 px-6 py-4 rounded-lg text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-2">회원가입 완료!</h2>
        <p>가입이 성공적으로 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.</p>
      </div>
    );
  }

  return (
    <div className="signup-form-container max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
      
      {formError && <ErrorMessage message={formError} />}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">사용자명</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            placeholder="사용자명을 입력하세요"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="이메일을 입력하세요"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            placeholder="비밀번호를 입력하세요 (6자 이상)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            placeholder="비밀번호를 다시 입력하세요"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <button 
            type="submit" 
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 disabled:bg-green-300"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" message="" /> : '회원가입'}
          </button>
        </div>
      </form>
      
      <div className="text-center text-gray-600">
        <p>
          이미 계정이 있으신가요? <a href="/login" className="text-blue-500 hover:underline">로그인</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;