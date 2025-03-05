import axiosInstance from './axios';
import axios from 'axios';
import { 
  CreateTetrisGameRequest, 
  CreateTetrisGameResponse, 
  TetrisMoveRequest, 
  TetrisMoveResponse, 
  TetrisGameStatusResponse, 
  TetrisPauseRequest, 
  TetrisPauseResponse,
  TetrisGameOverResponse,
  TetrisLeaderboardResponse,
  TetrisMoveType
} from '../types/models';

// 새 테트리스 게임 생성
export const createTetrisGame = async (options: CreateTetrisGameRequest = {}): Promise<CreateTetrisGameResponse> => {
  try {
    const response = await axiosInstance.post<CreateTetrisGameResponse>('/tetris', options);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 게임 상태 조회
export const getTetrisGameStatus = async (gameId: number): Promise<TetrisGameStatusResponse> => {
  try {
    const response = await axiosInstance.get<TetrisGameStatusResponse>(`/tetris/${gameId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 테트리스 블록 이동
export const makeMove = async (gameId: number, moveRequest: TetrisMoveRequest): Promise<TetrisMoveResponse> => {
  try {
    console.log(`API 호출: 게임 ID ${gameId}, 이동 타입 ${moveRequest.move_type}`);
    
    // 홀드 기능에 대한 특별 처리 - 현재 블록을 다음 블록으로 밀고 홀드 블록을 비우기 위한 파라미터 추가
    const requestData = { ...moveRequest };
    if (moveRequest.move_type === TetrisMoveType.HOLD) {
      // 홀드 기능 사용 시 clear_hold=true 파라미터 추가
      requestData.clear_hold = true;
    }
    
    const response = await axiosInstance.post<TetrisMoveResponse>(
      `/tetris/${gameId}/moves`, 
      requestData
    );
    console.log('API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('API 오류:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 게임 일시정지/재개
export const pauseGame = async (gameId: number, paused: boolean): Promise<TetrisPauseResponse> => {
  try {
    const response = await axiosInstance.post<TetrisPauseResponse>(
      `/tetris/${gameId}/pause`, 
      { paused } as TetrisPauseRequest
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 게임 포기/종료
export const forfeitTetrisGame = async (gameId: number): Promise<TetrisGameOverResponse> => {
  try {
    const response = await axiosInstance.delete<TetrisGameOverResponse>(`/tetris/${gameId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 리더보드 조회
export const getTetrisLeaderboard = async (limit: number = 10): Promise<TetrisLeaderboardResponse> => {
  try {
    const response = await axiosInstance.get<TetrisLeaderboardResponse>(`/tetris/leaderboard?limit=${limit}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('서버 연결에 실패했습니다.');
  }
};

// 사용자 최고 점수 조회
export const getUserHighScores = async (limit: number = 5): Promise<TetrisLeaderboardResponse> => {
    try {
      const response = await axiosInstance.get<TetrisLeaderboardResponse>(`/tetris/user/highscores?limit=${limit}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // 401 Unauthorized 에러를 구체적으로 처리
        if (error.response.status === 401) {
          throw {
            status: 401,
            detail: "인증이 필요합니다. 로그인해주세요.",
            message: "인증이 필요합니다. 로그인해주세요."
          };
        }
        throw error.response.data;
      }
      throw new Error('서버 연결에 실패했습니다.');
    }
  };