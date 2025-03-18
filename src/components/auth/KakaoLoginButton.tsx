import React from "react";

interface KakaoLoginButtonProps {
  className?: string;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({
  className = "",
}) => {
  const handleKakaoLogin = () => {
    // 현재 도메인 가져오기
    const successUri = encodeURIComponent(
      `${window.location.origin}/auth/kakao/success`
    );
    const errorUri = encodeURIComponent(
      `${window.location.origin}/auth/kakao/error`
    );

    // 백엔드의 카카오 로그인 엔드포인트로 리다이렉트
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/auth/kakao?success_uri=${successUri}&error_uri=${errorUri}`;
  };

  return (
    <button
      type="button"
      onClick={handleKakaoLogin}
      className={`w-full bg-yellow-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-yellow-400 transition duration-200 flex items-center justify-center ${className}`}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.48 3 2 6.48 2 11c0 2.76 1.33 5.19 3.38 6.74L3.7 21l3.8-2.28c1.36.48 2.87.76 4.5.76 5.52 0 10-3.48 10-8.5S17.52 3 12 3z" />
      </svg>
      카카오로 로그인
    </button>
  );
};

export default KakaoLoginButton;
