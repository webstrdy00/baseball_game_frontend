// 사용자 관련 타입
export interface User {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    created_at: string;
  }
  
  export interface UserCreate {
    username: string;
    email: string;
    password: string;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }
  
  export interface LoginResponse extends TokenResponse {
    user: User;
  }
  
  // 게임 관련 타입
  export interface CreateGameRequest {
    digits: number;
  }
  
  export interface CreateGameResponse {
    game_id: number;
    message: string;
  }
  
  export interface GuessRequest {
    guess: string;
  }
  
  export interface GuessResponse {
    strike: number;
    ball: number;
    attempts_used: number;
    attempts_left: number;
    status: string;
    message: string;
  }
  
  export interface GuessHistory {
    guess: string;
    strike: number;
    ball: number;
    created_at: string;
  }
  
  export interface GameStatusResponse {
    game_id: number;
    attempts_used: number;
    attempts_left: number;
    status: string;
    history: GuessHistory[];
    answer?: string;
  }
  
  export interface ForfeitResponse {
    message: string;
    status: string;
  }
  
  // 사용자 게임 히스토리 타입
  export interface GameHistoryItem {
    game_id: number;
    digits: number;
    status: string;
    attempts_used: number;
    created_at: string;
    last_guess: string | null;
    last_guess_time: string | null;
  }
  
  export interface UserGameHistoryResponse {
    username: string;
    total_games: number;
    games: GameHistoryItem[];
  }
  
  export interface GameDetailHistoryResponse {
    game_id: number;
    digits: number;
    status: string;
    attempts_used: number;
    created_at: string;
    guesses: GuessHistory[];
    answer: string | null;
  }