import axios, { isAxiosError as axiosIsAxiosError, AxiosInstance } from 'axios';

// 타입 확장
interface CustomAxiosInstance extends AxiosInstance {
  isAxiosError: typeof axiosIsAxiosError;
}

// 환경 변수에서 API URL 가져오기, 기본값으로 localhost:8000 사용
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 쿠키를 포함하기 위해 필요
  headers: {
    'Content-Type': 'application/json',
  },
}) as CustomAxiosInstance;

// 요청 인터셉터 - Authorization 헤더 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - Authorization 헤더에서 새 토큰 저장
axiosInstance.interceptors.response.use(
  (response) => {
    // Authorization 헤더에 새 토큰이 있으면 저장
    const authHeader = response.headers.authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      localStorage.setItem('access_token', token);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// isAxiosError 함수를 axiosInstance에 추가
axiosInstance.isAxiosError = axiosIsAxiosError;

export default axiosInstance;