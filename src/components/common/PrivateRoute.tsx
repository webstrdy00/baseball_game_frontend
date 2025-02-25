import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 로딩 중일 때는 로딩 인디케이터 표시
  if (loading) {
    return <div className="loading-container">로딩 중...</div>;
  }

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 인증된 사용자는 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default PrivateRoute;
