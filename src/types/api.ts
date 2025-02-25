export interface ApiError {
    detail: string;
    status_code?: number;
  }
  
  // Error 클래스를 확장하여 API 에러 클래스 생성
  export class ApiRequestError extends Error {
    detail: string;
    status?: number;
  
    constructor(message: string, status?: number) {
      super(message);
      this.name = 'ApiRequestError';
      this.detail = message;
      this.status = status;
    }
  }