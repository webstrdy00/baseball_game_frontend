/**
 * 환경별 로깅 유틸리티
 * 개발 환경에서만 콘솔 로그를 출력하고, 프로덕션에서는 무시합니다.
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * 개발 환경에서만 console.log 출력
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * 개발 환경에서만 console.error 출력
   */
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  /**
   * 개발 환경에서만 console.warn 출력
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * 개발 환경에서만 console.info 출력
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * 개발 환경에서만 console.debug 출력
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * 개발 환경에서만 console.table 출력
   */
  table: (data: any) => {
    if (isDevelopment) {
      console.table(data);
    }
  },

  /**
   * 개발 환경에서만 console.group 출력
   */
  group: (label?: string) => {
    if (isDevelopment) {
      console.group(label);
    }
  },

  /**
   * 개발 환경에서만 console.groupEnd 출력
   */
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  }
};

export default logger;