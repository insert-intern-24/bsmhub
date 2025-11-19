# Team Feature

팀 관련 페이지 및 기능 특화 컴포넌트들입니다.

## Components

- **TeamSidebar.tsx** - 팀 상세 페이지 사이드바

## 사용 위치

- `/team/[teamName]` - 팀 상세 페이지

## 주요 기능

- 팀 정보 표시
  - 팀 프로필 이미지
  - 팀 이름 및 설명
  - 팀원 목록
  - 연락처 정보
- 팀 관리 기능 (권한 있는 경우)
  - 팀 정보 수정
  - 팀원 관리

## 구조

```
Team Page
├── ProfileIcon (ui/profile/)
└── SidebarContentLayout
    ├── TeamSidebar
    │   ├── 팀 기본 정보
    │   ├── 팀원 목록
    │   └── 연락처
    └── ProjectGrid
        └── 팀의 프로젝트 목록
```

## 특징

- SidebarLayout 사용
- ProfileImage를 활용한 팀원 표시
- ProfileItem을 활용한 연락처 표시
- 반응형 디자인
