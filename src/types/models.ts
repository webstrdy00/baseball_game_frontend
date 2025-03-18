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
  email: string;
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
  digits: number;
  attempts_used: number;
  attempts_left: number;
  status: string;
  history: GuessHistory[];
  answer: string | null;
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

export interface TetrisPiece {
  type: string;
  shape: number[][];
  color: number;
  position: number[];
  rotation: number;
}

export interface CreateTetrisGameRequest {
  width?: number;
  height?: number;
  level?: number;
}

export interface CreateTetrisGameResponse {
  game_id: number;
  width: number;
  height: number;
  level: number;
  message: string;
}

export enum TetrisMoveType {
  LEFT = "left",
  RIGHT = "right",
  DOWN = "down",
  ROTATE = "rotate",
  DROP = "drop",
  HARD_DROP = "hard_drop",
  HOLD = "hold"
}

export interface TetrisMoveRequest {
  move_type: TetrisMoveType;
  clear_hold?: boolean;
  skip_store?: boolean;
}

export interface TetrisMoveResponse {
  success: boolean;
  board: number[][];
  current_piece: TetrisPiece | null;
  next_piece: TetrisPiece | null;
  held_piece: TetrisPiece | null;
  score: number;
  level: number;
  lines_cleared: number;
  line_clear_count: number;
  status: string;
  can_hold: boolean;
  message: string;
}

export interface TetrisGameStatusResponse {
  game_id: number;
  status: string;
  board: number[][];
  current_piece: TetrisPiece | null;
  next_piece: TetrisPiece | null;
  held_piece: TetrisPiece | null;
  score: number;
  level: number;
  lines_cleared: number;
  can_hold: boolean;
}

export interface TetrisPauseRequest {
  paused: boolean;
}

export interface TetrisPauseResponse {
  game_id: number;
  status: string;
  message: string;
}

export interface TetrisGameOverResponse {
  game_id: number;
  final_score: number;
  level_reached: number;
  lines_cleared: number;
  game_duration: number;
  high_score: boolean;
}

export interface TetrisHighScoreItem {
  username: string;
  score: number;
  level: number;
  lines_cleared: number;
  game_duration: number;
  created_at: string;
}

export interface TetrisLeaderboardResponse {
  scores: TetrisHighScoreItem[];
}
