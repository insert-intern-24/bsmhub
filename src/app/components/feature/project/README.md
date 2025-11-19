# Project Feature

프로젝트 관련 페이지 및 기능 특화 컴포넌트들입니다.

## Components

### 페이지 컴포넌트
- **ProjectPage.tsx** - 프로젝트 상세 페이지 메인 컴포넌트
- **ProjectSidebar.tsx** - 프로젝트 상세 페이지 사이드바

### 서브 컴포넌트 (components/)
- **ProjectEditModal.tsx** - 프로젝트 수정 모달
- **ProjectGrid.tsx** - 프로젝트 카드 그리드 레이아웃
- **ProjectMainContent.tsx** - 프로젝트 상세 페이지 메인 콘텐츠

### 유틸리티
- **staticParamsGenerator.ts** - Next.js static params 생성 함수

## 사용 위치

- `/portfolio/[profileName]/[projectName]` - 포트폴리오의 프로젝트 상세
- `/team/[teamName]/[projectName]` - 팀의 프로젝트 상세
- `/project` - 프로젝트 목록 (ProjectGrid)
- 홈 페이지 - 최신 프로젝트 (ProjectGrid)

## 구조

```
ProjectPage
├── ProfileIcon (ui/profile/)
└── SidebarContentLayout
    ├── ProjectSidebar
    │   ├── ProjectSummarySection
    │   ├── ProjectActionsSection
    │   ├── ProjectLinkSection
    │   ├── ProjectTechnologiesSection
    │   └── ProjectTeamSection
    └── ProjectMainContent
        └── 프로젝트 내용
```

## 주요 기능

- 프로젝트 상세 정보 표시
- 프로젝트 수정/삭제 (권한 있는 경우)
- 팀원 목록
- 사용 기술 스택
- 관련 링크
- 동적 라우팅 및 SSG 지원
