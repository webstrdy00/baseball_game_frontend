import axiosInstance from './axios';
import axios from 'axios'; // 원본 axios 가져오기
import { 
  CreateGameRequest, 
  CreateGameResponse, 
  GuessRequest, 
  GuessResponse, 
  GameStatusResponse, 
  ForfeitResponse 
} from '../types/models';

// 새 게임 생성
export const createGame = async (digits: number = 3): Promise<CreateGameResponse> => {
  try {
    const response = await axiosInstance.post<CreateGameResponse>('/games', { digits } as CreateGameRequest);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 게임에 숫자 추측
export const makeGuess = async (gameId: number, guess: string): Promise<GuessResponse> => {
  try {
    const response = await axiosInstance.post<GuessResponse>(
      `/games/${gameId}/guesses`, 
      { guess } as GuessRequest
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 게임 상태 조회
export const getGameStatus = async (gameId: number): Promise<GameStatusResponse> => {
  try {
    const response = await axiosInstance.get<GameStatusResponse>(`/games/${gameId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 게임 포기
export const forfeitGame = async (gameId: number): Promise<ForfeitResponse> => {
  try {
    const response = await axiosInstance.delete<ForfeitResponse>(`/games/${gameId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};