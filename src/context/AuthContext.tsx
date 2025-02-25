import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { User } from "../types/models";
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
} from "../api/auth";
import { LoginCredentials } from "../types/models";

// 인증 컨텍스트의 타입 정의
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// 기본값 생성
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  login: async () => null,
  logout: async () => {},
  isAuthenticated: false,
};

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Provider props 타입 정의
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider 컴포넌트
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 초기화 시 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // 로컬 스토리지에서 사용자 정보와 토큰 확인
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("access_token");

        if (token && storedUser) {
          // 토큰이 있으면 유효성 검사
          try {
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (error: unknown) {
            console.error("토큰 검증 오류:", error);
            // 토큰이 유효하지 않으면 로그아웃 처리
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("인증 초기화 오류:", err);
        setError("인증 초기화 중 오류가 발생했습니다.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 로그인 처리
  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiLogin(credentials);
      setUser(data.user);
      return data.user;
    } catch (err: unknown) {
      console.error("로그인 오류:", err);
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? (err.message as string)
          : "로그인 중 오류가 발생했습니다."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 처리
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } catch (err: unknown) {
      console.error("로그아웃 오류:", err);
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? (err.message as string)
          : "로그아웃 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 공개할 컨텍스트 값
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 커스텀 훅으로 컨텍스트 사용 간편화
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};

export default AuthContext;
