import axios, { isAxiosError as axiosIsAxiosError, AxiosInstance } from "axios";

// 타입 확장
interface CustomAxiosInstance extends AxiosInstance {
  isAxiosError: typeof axiosIsAxiosError;
}

// 환경 변수에서 API URL 가져오기, 기본값으로 localhost:8000 사용
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키를 주고받기 위해 필요
  headers: {
    "Content-Type": "application/json",
  },
}) as CustomAxiosInstance;

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("access_token");

    // 토큰이 있으면 헤더에 추가
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 쿠키에 있는 리프레시 토큰으로 새 토큰 요청
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // 새 토큰 저장
        const newToken = refreshResponse.data.access_token;
        localStorage.setItem("access_token", newToken);

        // 새 토큰으로 원래 요청 헤더 업데이트
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        // 원래 요청 재시도
        return axios(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// isAxiosError 함수를 axiosInstance에 추가
axiosInstance.isAxiosError = axiosIsAxiosError;

export default axiosInstance;
