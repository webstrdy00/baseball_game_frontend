import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { getCurrentUser } from "../api/auth";
import { User } from "../types/models";
import logger from "../utils/logger";

const KakaoAuthSuccessPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setCurrentUser } = useAuth();

  useEffect(() => {
    const processToken = async () => {
      try {
        // 해시 프래그먼트에서 토큰 추출
        const hash = window.location.hash.substring(1);
        logger.log("해시 프래그먼트:", hash); // 디버깅용 로그

        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");

        logger.log("추출된 토큰:", accessToken ? "토큰 있음" : "토큰 없음"); // 디버깅용 로그

        if (!accessToken) {
          throw new Error("액세스 토큰이 없습니다.");
        }

        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem("access_token", accessToken);
        logger.log("토큰 저장됨");

        // 약간의 지연을 추가하여 토큰이 적용될 시간을 줌
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          // 사용자 정보 가져오기
          const userData = await getCurrentUser();

          // 로컬 스토리지에 사용자 정보 저장
          localStorage.setItem("user", JSON.stringify(userData));
          logger.log("사용자 정보 가져옴:", userData);

          // AuthContext 상태 업데이트
          setCurrentUser(userData);

          // 로딩 상태 업데이트
          setLoading(false);

          // 홈페이지로 리다이렉트
          navigate("/", { replace: true });
        } catch (apiError) {
          logger.error("API 호출 오류:", apiError);

          // 백엔드에서 사용자 정보를 가져오지 못했을 때 hash 프래그먼트에서 사용자 정보 확인
          const userParam = params.get("user");
          if (userParam) {
            try {
              // URL에서 사용자 정보 추출 시도
              const userData = JSON.parse(
                decodeURIComponent(userParam)
              ) as User;
              localStorage.setItem("user", JSON.stringify(userData));
              setCurrentUser(userData);
              logger.log("URL에서 사용자 정보 복원:", userData);
            } catch (parseError) {
              logger.error("사용자 정보 파싱 오류:", parseError);
            }
          }

          // API 호출에 실패한 경우에도 사용자를 홈으로 리다이렉트
          setLoading(false);
          navigate("/", { replace: true });
        }
      } catch (err) {
        logger.error("카카오 로그인 처리 오류:", err);
        setError("카카오 로그인 처리 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    // 이미 인증된 사용자는 홈으로 리다이렉트
    if (isAuthenticated) {
      navigate("/");
      return;
    }

    processToken();
  }, [location, navigate, isAuthenticated, setCurrentUser]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <LoadingSpinner size="large" message="카카오 로그인 처리 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <ErrorMessage message={error} />
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return null;
};

export default KakaoAuthSuccessPage;
