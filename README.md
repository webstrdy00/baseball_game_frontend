# 🎮 Game Center - 미니게임 컬렉션
![Game Center](public/tetris-icon.svg)

## 🏫 프로젝트 소개
**Game Center**는 숫자 야구 게임과 테트리스를 즐길 수 있는 웹 애플리케이션입니다. 사용자 인증, 게임 기록 저장, 리더보드 기능을 제공해 게임 경험을 향상시킵니다.

## ✅ 프로젝트 핵심 목표
- **🎲 다양한 게임**: 숫자 야구와 테트리스 두 종류의 미니게임 구현
- **👤 사용자 인증**: 일반 로그인 및 카카오 소셜 로그인 지원
- **📊 게임 기록**: 사용자별 게임 기록 및 통계 제공
- **🏆 리더보드**: 테트리스 최고 점수 리더보드 구현
- **📱 반응형 디자인**: 다양한 디바이스에서 최적화된 사용자 경험 제공

## 📌 주요 기능

### ⚾ 숫자 야구 게임
- **게임 규칙**: 컴퓨터가 생성한 중복되지 않는 숫자를 맞추는 추리 게임
- **난이도 설정**: 3~5자리 숫자 중 선택 가능
- **힌트 시스템**: 스트라이크(S)와 볼(B) 힌트 제공
- **게임 기록**: 게임 결과 저장 및 통계 제공

### 🧱 테트리스
- **클래식 게임플레이**: 블록을 조작해 라인을 완성하는 고전 게임
- **홀드 기능**: 현재 블록을 저장하고 나중에 사용 가능
- **레벨 시스템**: 점수에 따라 레벨 상승 및 속도 증가
- **리더보드**: 전체 순위 및 개인 최고 점수 확인 가능

### 👤 사용자 관리
- **계정 시스템**: 이메일 기반 회원가입 및 로그인
- **소셜 로그인**: 카카오 계정을 통한 간편 로그인
- **프로필 페이지**: 개인 게임 기록 및 통계 확인

## 🛠️ 기술 스택

### Frontend
- ![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?logo=typescript&logoColor=white)
- ![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite&logoColor=white)
- ![Axios](https://img.shields.io/badge/Axios-API_Fetching-5A29E4?logo=axios&logoColor=white)
- ![React Router](https://img.shields.io/badge/React_Router-DOM-CA4245?logo=react-router&logoColor=white)

### Backend (외부 API)
- ![FastAPI](https://img.shields.io/badge/FastAPI-Integration-009688?logo=fastapi&logoColor=white)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql&logoColor=white)

### 외부 인증
- ![Kakao](https://img.shields.io/badge/Kakao-Social_Login-FFCD00?logo=kakao&logoColor=black)

### DevOps
- ![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?logo=vercel&logoColor=white)
- ![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)

## 📄 프로젝트 구조
```
src/
├── api/              # API 요청 함수
├── assets/           # 이미지, 아이콘 등의 자원
├── components/       # 재사용 가능한 컴포넌트
│   ├── auth/         # 인증 관련 컴포넌트 
│   ├── common/       # 공통 컴포넌트
│   ├── game/         # 숫자 야구 게임 컴포넌트
│   ├── layout/       # 레이아웃 컴포넌트
│   ├── profile/      # 프로필 페이지 컴포넌트
│   └── tetris/       # 테트리스 게임 컴포넌트
├── context/          # Context API 관련 코드
├── hooks/            # 커스텀 훅
├── pages/            # 페이지 컴포넌트
└── types/            # TypeScript 타입 정의
```

## 📊 주요 구현 사항

### 🔷 상태 관리
- **Context API**를 활용한 전역 상태 관리 구현
  - AuthContext: 인증 정보 관리
  - GameContext: 숫자 야구 게임 상태 관리
  - TetrisContext: 테트리스 게임 상태 관리

### 🔷 테트리스 게임 엔진
- 테트리스 블록 움직임, 회전, 충돌 검사 구현
- 라인 완성 시 제거 및 점수 계산 알고리즘
- 사용자 입력(키보드, 터치) 처리
- 자동 하강 타이머 구현

### 🔷 인증 시스템
- JWT 기반 인증 시스템 구현
- Refresh Token을 통한 자동 재인증
- 소셜 로그인(카카오) 통합

### 🔷 반응형 디자인
- 모바일, 태블릿, 데스크탑 등 다양한 화면 크기 지원
- CSS Module 및 Tailwind 클래스를 활용한 스타일링

## 📱 주요 화면

### 홈페이지
- 게임 선택 및 소개
- 로그인/회원가입 또는 게스트 플레이 옵션

### 숫자 야구 게임
- 게임 생성 및 난이도 선택 화면
- 게임 플레이 화면 (추측 입력, 힌트 표시)
- 게임 결과 모달

### 테트리스
- 게임 생성 및 레벨 선택 화면
- 게임 플레이 화면 (블록 조작, 점수 표시)
- 게임 오버 모달
- 리더보드 화면

### 프로필
- 사용자 정보 및 게임 통계
- 게임 기록 목록
- 게임 상세 정보 모달

## 🧠 문제 해결 및 최적화

### 🔹 테트리스 성능 최적화
- 컴포넌트 메모이제이션을 통한 불필요한 리렌더링 방지
- CSS Transform 및 will-change 속성을 통한 렌더링 성능 향상
- 조건부 상태 업데이트를 통한 렌더링 최적화

### 🔹 동시성 문제 해결
- 테트리스 홀드 기능에서 발생할 수 있는 동시성 문제 해결
- 자동 하강 타이머와 사용자 입력 간의 경쟁 상태 방지

### 🔹 인증 토큰 관리
- Axios 인터셉터를 활용한 자동 토큰 갱신
- 토큰 만료 시 자동 로그아웃 및 리다이렉트 처리

## 📚 학습 내용 및 발전 방향
### 학습 내용
- React와 TypeScript를 활용한 웹 애플리케이션 개발
- Context API를 활용한 효율적인 상태 관리
- 게임 로직 구현 및 최적화
- 외부 API 연동 및 JWT 인증 처리

### 향후 발전 방향
- 다양한 미니게임 추가 (테트리스 AI, 오목, 카드 게임 등)
- 멀티플레이어 기능 구현
- 모바일 네이티브 앱 개발 (React Native)
- 게임 커스터마이징 기능 추가
