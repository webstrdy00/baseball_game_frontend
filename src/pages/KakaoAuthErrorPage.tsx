import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";

const KakaoAuthErrorPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>(
    "카카오 로그인 중 오류가 발생했습니다."
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 해시 프래그먼트에서 오류 메시지 추출
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const error = params.get("error");

    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">로그인 오류</h1>
        <ErrorMessage message={errorMessage} />
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default KakaoAuthErrorPage;
