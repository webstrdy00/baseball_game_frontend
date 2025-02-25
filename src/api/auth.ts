import axiosInstance from './axios';
import axios from 'axios';
import { 
  User, 
  UserCreate, 
  LoginCredentials, 
  LoginResponse, 
  TokenResponse,
  UserGameHistoryResponse,
  GameDetailHistoryResponse
} from '../types/models';

// 회원가입
export const signup = async (userData: UserCreate): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>('/auth/signup', userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 로그인
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    
    // 로컬 스토리지에 토큰 저장
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 로그아웃
export const logout = async (): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post<{ message: string }>('/auth/logout');
    
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 토큰 갱신
export const refreshToken = async (refreshToken: string): Promise<TokenResponse> => {
  try {
    const response = await axiosInstance.post<TokenResponse>('/auth/refresh', { refresh_token: refreshToken });
    
    // 로컬 스토리지에 새 토큰 저장
    localStorage.setItem('access_token', response.data.access_token);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 현재 사용자 정보 조회
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 사용자 게임 히스토리 조회
export const getUserGameHistory = async (): Promise<UserGameHistoryResponse> => {
  try {
    const response = await axiosInstance.get<UserGameHistoryResponse>('/auth/history');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 특정 게임 상세 히스토리 조회
export const getGameDetailHistory = async (gameId: number): Promise<GameDetailHistoryResponse> => {
  try {
    const response = await axiosInstance.get<GameDetailHistoryResponse>(`/auth/history/${gameId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};