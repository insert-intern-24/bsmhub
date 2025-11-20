# Auth Feature

인증 관련 기능을 담당하는 컴포넌트들입니다.

## Components

- **Account.tsx** - 로그인/로그아웃 버튼을 포함한 사용자 계정 드롭다운
- **GoogleOneTab.tsx** - Google One Tap 로그인 UI
- **LoginBox.tsx** - 로그인 박스 컴포넌트
- **SupabaseSessionSync.tsx** - Supabase 세션 동기화 컴포넌트

## 사용 위치

- Header: Account 컴포넌트
- 홈 페이지: GoogleOneTab, LoginBox

## 특징

- Supabase 인증 시스템과 통합
- Google OAuth 지원
- 세션 관리 및 동기화
