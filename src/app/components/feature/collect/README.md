# Collect Feature

프로젝트 및 팀 검색/필터링 기능을 담당하는 컴포넌트들입니다.

## Components

- **CollectClient.tsx** - 검색 및 필터링 UI를 제공하는 클라이언트 컴포넌트
- **constants.ts** - 탭 모드 및 검색 관련 상수 정의

## 사용 위치

- `/project` 페이지
- `/team` 페이지

## 주요 기능

- 프로젝트/팀 검색
- 카테고리별 필터링
- 탭 전환 (전체/나의 프로젝트 등)
- 검색 결과 그리드 표시

## 탭 모드

`constants.ts`에 정의된 `TabMode`:
- 전체 보기
- 나의 항목만 보기
- 기타 필터링 옵션
