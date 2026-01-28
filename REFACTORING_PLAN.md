# BSMHub 프론트엔드 리팩토링 계획서

> **작성일**: 2026-01-28
> **기술 스택**: Next.js 15.5.9, React 19.2.0, TypeScript 5.9.3, TanStack Query, Supabase, Tailwind CSS

---

## 목차

1. [현재 상태 요약](#1-현재-상태-요약)
2. [핵심 문제점](#2-핵심-문제점)
3. [리팩토링 우선순위 매트릭스](#3-리팩토링-우선순위-매트릭스)
4. [Phase 1: 즉시 개선 (1-2주)](#4-phase-1-즉시-개선-1-2주)
5. [Phase 2: 단기 개선 (3-4주)](#5-phase-2-단기-개선-3-4주)
6. [Phase 3: 중기 개선 (1-2개월)](#6-phase-3-중기-개선-1-2개월)
7. [Phase 4: 장기 개선 (2-3개월)](#7-phase-4-장기-개선-2-3개월)
8. [아키텍처 개선 제안](#8-아키텍처-개선-제안)
9. [코드 컨벤션 가이드](#9-코드-컨벤션-가이드)
10. [성과 측정 지표](#10-성과-측정-지표)

---

## 1. 현재 상태 요약

### 프로젝트 규모
| 항목 | 수치 |
|------|------|
| 총 컴포넌트 수 | 218개 |
| 총 코드 라인 | ~26,748줄 (컴포넌트만) |
| 서비스 파일 | 30+ 파일 |
| 커스텀 훅 | 16개 |

### 기술 스택 강점
- ✅ Next.js App Router 적극 활용
- ✅ TypeScript strict 모드 적용
- ✅ TanStack Query로 서버 상태 관리
- ✅ Zod 스키마 기반 폼 검증
- ✅ GraphQL 서비스 레이어 분리

### 주요 약점
- ❌ 과도하게 큰 컴포넌트 (14개 > 200줄)
- ❌ Prop Drilling 심화 (5단계)
- ❌ 테스트 코드 부재
- ❌ 하드코딩된 매직 넘버
- ❌ 비일관적인 네이밍 컨벤션

---

## 2. 핵심 문제점

### 2.1 대형 컴포넌트 (Critical)

| 파일 | 줄 수 | 문제점 |
|------|-------|--------|
| `tiptap/simple-editor.tsx` | 579 | 에디터 + 툴바 + 업로드 로직 혼재 |
| `tiptap/image-upload-node.tsx` | 554 | 너무 많은 책임 |
| `modal/inputs/InputListProvider.tsx` | 382 | 상태관리 + 검증 + 렌더링 혼재 |
| `ui/input/InputOfModal.tsx` | 329 | 복잡한 조건부 로직 |
| `services/config/projectConfig.ts` | 552 | GraphQL 쿼리 중복 |

### 2.2 하드코딩된 값들

```typescript
// 현재 상태 (문제)
const SLIDE_INTERVAL = 1500;           // 매직 넘버
window.alert('파일 크기가 제한을 초과'); // 하드코딩 메시지
setItemsPerPage(window.innerWidth >= 1024 ? 24 : 8); // 브레이크포인트
style={{ transitionDuration: '1000ms' }}  // 인라인 스타일
```

### 2.3 성능 문제 패턴

```typescript
// 문제 1: 매 렌더링마다 새 객체 생성
const initialConfig = config.inputs.map((input) => ({ ... }));

// 문제 2: useCallback 누락
const handleClickOutside = (event) => { ... }; // 매번 재생성

// 문제 3: 불필요한 Context 구독
// 모든 드롭다운이 같은 Context를 구독 → 전체 리렌더링
```

### 2.4 Prop Drilling 심각도

```
ProjectPage (Server)
  └─ ProjectSidebar (hasEditPermission, project, mode, ...)
       └─ ProjectSummarySection (project, hasEditPermission)
            └─ ProjectActionsSection (project, hasEditPermission, onEdit)
                 └─ ProjectButton (hasEditPermission, onClick)
```

---

## 3. 리팩토링 우선순위 매트릭스

```
영향도 (높음)
    │
    │  [Phase 1]              [Phase 2]
    │  • 상수 파일 생성        • 대형 컴포넌트 분리
    │  • 네이밍 컨벤션 통일    • Context 패턴 확장
    │  • ESLint 규칙 강화      • Hook 최적화
    │
    │  [Phase 3]              [Phase 4]
    │  • GraphQL 쿼리 통합     • 테스트 코드 추가
    │  • 상태관리 재설계       • Storybook 구축
    │  • Server/Client 최적화  • 모니터링 강화
    │
    └────────────────────────────────────→ 난이도 (높음)
```

---

## 4. Phase 1: 즉시 개선 (1-2주)

### 4.1 상수 및 설정 파일 생성

**파일 생성: `src/shared/constants/config.ts`**

```typescript
// ============================================
// 타이밍 상수
// ============================================
export const TIMING = {
  SLIDE_INTERVAL: 1500,
  TRANSITION_DURATION: 1000,
  DEBOUNCE_DELAY: 300,
  MODAL_ANIMATION: 200,
  TOAST_DURATION: 3000,
} as const;

// ============================================
// 제한값 상수
// ============================================
export const LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES_PER_PROJECT: 3,
  ITEMS_PER_PAGE_MOBILE: 8,
  ITEMS_PER_PAGE_DESKTOP: 24,
  MAX_SKILL_TAGS: 10,
  MAX_TEAM_MEMBERS: 20,
} as const;

// ============================================
// 브레이크포인트
// ============================================
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  WIDE: 1536,
} as const;

// ============================================
// API 설정
// ============================================
export const API_CONFIG = {
  RETRY_COUNT: 3,
  STALE_TIME: 5 * 1000,
  GC_TIME: 5 * 60 * 1000,
} as const;

// ============================================
// 정규식 패턴
// ============================================
export const PATTERNS = {
  PROFILE_NAME: /^[가-힣A-Za-z0-9_-]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
} as const;
```

**파일 생성: `src/shared/constants/messages.ts`**

```typescript
export const ERROR_MESSAGES = {
  FILE_SIZE_EXCEEDED: '파일 크기가 제한을 초과했습니다. 최대 5MB까지 업로드 가능합니다.',
  INVALID_FILE_TYPE: '지원하지 않는 파일 형식입니다.',
  LOGIN_REQUIRED: '로그인이 필요합니다.',
  SAVE_FAILED: '저장에 실패했습니다. 다시 시도해주세요.',
  LOAD_FAILED: '데이터를 불러오는데 실패했습니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
} as const;

export const SUCCESS_MESSAGES = {
  SAVE_COMPLETE: '저장되었습니다.',
  DELETE_COMPLETE: '삭제되었습니다.',
  COPY_COMPLETE: '클립보드에 복사되었습니다.',
} as const;

export const CONFIRM_MESSAGES = {
  DELETE_PROJECT: '정말 이 프로젝트를 삭제하시겠습니까?',
  LEAVE_PAGE: '저장하지 않은 변경사항이 있습니다. 페이지를 떠나시겠습니까?',
} as const;
```

### 4.2 네이밍 컨벤션 통일

**파일명 규칙 (kebab-case 통일)**

```bash
# 변경 대상
AutoSlidingBusinessCardClient.tsx → auto-sliding-business-card-client.tsx
ProjectPage.tsx → project-page.tsx
InputOfModal.tsx → input-of-modal.tsx

# Hook 파일
useInputList.ts → use-input-list.ts
useCurrentUser.ts → use-current-user.ts
```

**컴포넌트/변수 네이밍 규칙**

```typescript
// 컴포넌트: PascalCase
export function ProjectCard() { ... }

// Hook: camelCase with 'use' prefix
export function useProjectData() { ... }

// 상수: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// 이벤트 핸들러: handle{Action}
const handleSubmit = () => { ... };
const handleFileChange = () => { ... };

// 불리언 변수: is/has/can/should prefix
const isLoading = true;
const hasPermission = false;
const canEdit = true;
```

### 4.3 ESLint 규칙 강화

**파일 수정: `eslint.config.mjs`**

```javascript
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // 파일 크기 제한 (경고)
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],

      // 함수 크기 제한
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],

      // 복잡도 제한
      'complexity': ['warn', 10],

      // Hook 규칙 강화
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',

      // 일관성 규칙
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],

      // TypeScript 강화
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // 콘솔 제거 (production)
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];

export default eslintConfig;
```

### 4.4 즉시 수정할 코드 패턴

**Before → After 예시**

```typescript
// ❌ Before: 하드코딩
if (file.size > 5 * 1024 * 1024) {
  window.alert('파일 크기가 제한을 초과했습니다');
}

// ✅ After: 상수 사용
import { LIMITS, ERROR_MESSAGES } from '@/shared/constants';

if (file.size > LIMITS.MAX_IMAGE_SIZE) {
  showToast(ERROR_MESSAGES.FILE_SIZE_EXCEEDED, 'error');
}
```

```typescript
// ❌ Before: 인라인 스타일
style={{ transitionDuration: '1000ms' }}

// ✅ After: 상수 + Tailwind
import { TIMING } from '@/shared/constants';

className={`transition-transform duration-[${TIMING.TRANSITION_DURATION}ms]`}
// 또는 CSS 변수 활용
style={{ transitionDuration: `${TIMING.TRANSITION_DURATION}ms` }}
```

---

## 5. Phase 2: 단기 개선 (3-4주)

### 5.1 대형 컴포넌트 분리

#### simple-editor.tsx 분리 계획 (579줄 → 4개 파일)

```
src/app/components/tiptap/
├── simple-editor/
│   ├── index.tsx              # 메인 에디터 (150줄)
│   ├── toolbar/
│   │   ├── main-toolbar.tsx   # 데스크톱 툴바 (100줄)
│   │   └── mobile-toolbar.tsx # 모바일 툴바 (50줄)
│   ├── hooks/
│   │   ├── use-editor-config.ts    # 에디터 설정 (80줄)
│   │   └── use-image-upload.ts     # 이미지 업로드 (100줄)
│   └── utils/
│       └── validation.ts      # 파일 검증 (30줄)
```

**분리된 Hook 예시: `use-image-upload.ts`**

```typescript
import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { LIMITS, ERROR_MESSAGES } from '@/shared/constants';

interface UseImageUploadOptions {
  editor: Editor | null;
  maxImages?: number;
  onError?: (error: Error) => void;
}

export function useImageUpload({
  editor,
  maxImages = LIMITS.MAX_IMAGES_PER_PROJECT,
  onError,
}: UseImageUploadOptions) {
  const validateFile = useCallback((file: File): boolean => {
    if (file.size > LIMITS.MAX_IMAGE_SIZE) {
      onError?.(new Error(ERROR_MESSAGES.FILE_SIZE_EXCEEDED));
      return false;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      onError?.(new Error(ERROR_MESSAGES.INVALID_FILE_TYPE));
      return false;
    }

    return true;
  }, [onError]);

  const uploadAndInsert = useCallback(async (file: File) => {
    if (!editor || !validateFile(file)) return;

    // 업로드 로직...
  }, [editor, validateFile]);

  return {
    validateFile,
    uploadAndInsert,
  };
}
```

#### InputListProvider.tsx 분리 계획 (382줄 → 3개 파일)

```
src/app/components/modal/inputs/
├── input-list-provider/
│   ├── index.tsx                    # 프로바이더 (120줄)
│   ├── input-list-context.tsx       # Context 정의 (40줄)
│   └── hooks/
│       ├── use-input-list-state.ts  # 상태 관리 (80줄)
│       └── use-dropdown-data.ts     # 드롭다운 데이터 (60줄)
```

### 5.2 Context 패턴 확장

**새로운 ProjectContext 생성**

```typescript
// src/app/contexts/project-context.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface ProjectContextValue {
  project: Project;
  hasEditPermission: boolean;
  mode: 'read' | 'edit';
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: ProjectContextValue;
}) {
  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}

// 선택적 접근 (권한만 필요할 때)
export function useProjectPermission() {
  const { hasEditPermission } = useProject();
  return hasEditPermission;
}
```

**적용 예시**

```typescript
// Before: Prop Drilling
<ProjectSidebar
  project={project}
  hasEditPermission={perm}
  mode={mode}
  onEdit={handleEdit}
/>

// After: Context 사용
<ProjectProvider value={{ project, hasEditPermission: perm, mode, onEdit: handleEdit }}>
  <ProjectSidebar />
</ProjectProvider>

// 자식 컴포넌트
function ProjectSidebar() {
  const { project, hasEditPermission } = useProject();
  // ...
}
```

### 5.3 Hook 최적화

**useCallback/useMemo 추가 필요 위치**

```typescript
// src/app/components/ui/dropdown/Dropdown.tsx
// Before
const handleClickOutside = (event: MouseEvent) => {
  // ...
};

// After
const handleClickOutside = useCallback((event: MouseEvent) => {
  const target = event.target as Node | null;
  if (target && containerRef.current && !containerRef.current.contains(target)) {
    setOpenState(false);
  }
}, []);

// src/app/components/modal/inputs/InputListProvider.tsx
// Before
const initialConfig = config.inputs.map((input) => ({ ... }));

// After
const initialConfig = useMemo(
  () => config.inputs.map((input) => ({ ... })),
  [config.inputs]
);
```

---

## 6. Phase 3: 중기 개선 (1-2개월)

### 6.1 GraphQL 쿼리 통합

**현재 문제점**
- `projectConfig.ts`, `profileConfig.ts`, `teamProfileConfig.ts`에 유사한 쿼리 중복
- 각 파일마다 550+ 줄의 설정

**해결책: Query Builder 패턴**

```typescript
// src/services/graphql/query-factory.ts
export function createReadQuery(tableName: string, fields: FieldConfig[]): string {
  const fieldSelections = fields
    .map((field) => {
      if (field.relation) {
        return `${field.columnInfo.column} {
          edges {
            node {
              ${field.relation.columns.join('\n              ')}
            }
          }
        }`;
      }
      return field.columnInfo.column;
    })
    .join('\n      ');

  return `
    query Get${capitalize(tableName)}($id: BigInt!) {
      ${tableName}Collection(filter: { id: { eq: $id } }) {
        edges {
          node {
            ${fieldSelections}
          }
        }
      }
    }
  `;
}

// 사용 예시
const projectQuery = createReadQuery('projects', [
  { columnInfo: { column: 'id' } },
  { columnInfo: { column: 'title' } },
  {
    columnInfo: { column: 'project_skills' },
    relation: { columns: ['skill_id', 'skill_name'] }
  },
]);
```

### 6.2 Server/Client Component 최적화

**불필요한 'use client' 제거 대상**

```typescript
// 현재 'use client'지만 제거 가능
// - ui/text/text.tsx (단순 렌더링)
// - ui/label/InputLabel.tsx (단순 렌더링)
// - ui/badge/Badge.tsx (상호작용 없음)

// 최적화된 구조
// ServerComponent.tsx (데이터 페칭)
export default async function ProjectPage() {
  const data = await fetchProjectData();
  return <ClientWrapper data={data} />;
}

// ClientWrapper.tsx (상호작용)
'use client';
export function ClientWrapper({ data }) {
  const [state, setState] = useState();
  return <InteractiveUI data={data} state={state} />;
}
```

### 6.3 상태관리 재설계

**현재 상태 관리 계층**
```
Context API (Toast, Modal)
    ↓
React Query (서버 상태)
    ↓
useState/useReducer (로컬 상태)
```

**개선된 상태 관리 (Zustand 도입 검토)**

```typescript
// src/stores/ui-store.ts
import { create } from 'zustand';

interface UIState {
  // 모달 상태
  modalStack: ModalItem[];
  openModal: (content: ReactNode) => void;
  closeModal: () => void;

  // 토스트 상태
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;

  // 글로벌 로딩
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  modalStack: [],
  openModal: (content) => set((state) => ({
    modalStack: [...state.modalStack, { id: Date.now(), content }]
  })),
  closeModal: () => set((state) => ({
    modalStack: state.modalStack.slice(0, -1)
  })),
  // ...
}));
```

---

## 7. Phase 4: 장기 개선 (2-3개월)

### 7.1 테스트 코드 추가

**테스트 설정**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/services/supabase/database.types.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**테스트 예시**

```typescript
// src/app/components/ui/button/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button text="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button text="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button text="Disabled" disabled />);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

**커버리지 목표**

| 레이어 | 현재 | 목표 (3개월) |
|--------|------|-------------|
| UI Components | 0% | 80% |
| Hooks | 0% | 70% |
| Services | 0% | 60% |
| Utils | 0% | 90% |
| **전체** | **0%** | **70%** |

### 7.2 Storybook 구축

```bash
npx storybook@latest init
```

**컴포넌트 문서화 예시**

```typescript
// src/app/components/ui/button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['black', 'blue', 'gray'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: 'Primary Button',
    color: 'blue',
  },
};

export const Secondary: Story = {
  args: {
    text: 'Secondary Button',
    color: 'gray',
  },
};

export const Disabled: Story = {
  args: {
    text: 'Disabled Button',
    disabled: true,
  },
};
```

### 7.3 모니터링 강화

**Web Vitals 추적 개선**

```typescript
// src/app/providers/WebVitalsProvider.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsProvider({ children }: { children: React.ReactNode }) {
  useReportWebVitals((metric) => {
    // Sentry에 전송
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureMessage(`Web Vital: ${metric.name}`, {
        level: metric.rating === 'poor' ? 'warning' : 'info',
        tags: {
          metric: metric.name,
          rating: metric.rating,
        },
        extra: {
          value: metric.value,
          id: metric.id,
        },
      });
    }

    // Analytics에 전송
    if (metric.rating === 'poor') {
      console.warn(`Poor Web Vital: ${metric.name} = ${metric.value}`);
    }
  });

  return <>{children}</>;
}
```

---

## 8. 아키텍처 개선 제안

### 8.1 권장 디렉토리 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # 라우트 그룹
│   ├── api/                      # API Routes
│   └── layout.tsx
│
├── components/                   # 컴포넌트 (app 외부로 이동)
│   ├── ui/                       # 기본 UI (Button, Input, ...)
│   ├── common/                   # 공통 컴포넌트 (Card, Modal, ...)
│   ├── features/                 # 기능별 컴포넌트
│   │   ├── project/
│   │   ├── portfolio/
│   │   └── team/
│   └── layouts/                  # 레이아웃 컴포넌트
│
├── hooks/                        # 커스텀 훅
│   ├── use-debounce.ts
│   ├── use-current-user.ts
│   └── ...
│
├── services/                     # API/비즈니스 로직
│   ├── api/                      # API 클라이언트
│   ├── graphql/                  # GraphQL 서비스
│   └── supabase/                 # Supabase 설정
│
├── stores/                       # 상태 관리 (Zustand 등)
│
├── lib/                          # 라이브러리 래퍼
│
├── types/                        # 타입 정의
│
├── constants/                    # 상수
│   ├── config.ts
│   └── messages.ts
│
├── styles/                       # 글로벌 스타일
│
└── test/                         # 테스트 설정
    └── setup.ts
```

### 8.2 Import 정리 규칙

```typescript
// 1. React/Next.js
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. 내부 - 절대 경로 (상위 → 하위)
import { Button } from '@/components/ui/button';
import { useProject } from '@/hooks/use-project';
import { LIMITS } from '@/constants/config';

// 4. 상대 경로 (같은 모듈)
import { ProjectCard } from './project-card';
import type { ProjectProps } from './types';
```

---

## 9. 코드 컨벤션 가이드

### 9.1 컴포넌트 작성 규칙

```typescript
// ✅ 권장 패턴
'use client';

import { memo, useCallback, useMemo } from 'react';

// Types 먼저
interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  className?: string;
}

// 컴포넌트 정의
function ProjectCardComponent({
  project,
  onEdit,
  className,
}: ProjectCardProps) {
  // 1. Hooks
  const { hasPermission } = useProject();

  // 2. Memoized values
  const displayDate = useMemo(
    () => formatDate(project.createdAt),
    [project.createdAt]
  );

  // 3. Callbacks
  const handleEdit = useCallback(() => {
    onEdit?.();
  }, [onEdit]);

  // 4. Early returns
  if (!project) return null;

  // 5. Render
  return (
    <article className={cn('project-card', className)}>
      {/* JSX */}
    </article>
  );
}

// Export with memo (선택적)
export const ProjectCard = memo(ProjectCardComponent);
```

### 9.2 Hook 작성 규칙

```typescript
// ✅ 권장 패턴
import { useState, useCallback, useEffect } from 'react';

interface UseProjectDataOptions {
  id: string;
  enabled?: boolean;
}

interface UseProjectDataReturn {
  project: Project | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useProjectData({
  id,
  enabled = true,
}: UseProjectDataOptions): UseProjectDataReturn {
  const [state, setState] = useState<{
    project: Project | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    project: null,
    isLoading: enabled,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetchProject(id);
      setState({ project: data, isLoading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, [id]);

  useEffect(() => {
    if (enabled) {
      refetch();
    }
  }, [enabled, refetch]);

  return { ...state, refetch };
}
```

### 9.3 파일 크기 제한

| 파일 유형 | 최대 줄 수 | 초과 시 조치 |
|-----------|-----------|-------------|
| 컴포넌트 | 200줄 | 서브 컴포넌트 분리 |
| Hook | 100줄 | 헬퍼 함수 분리 |
| 유틸리티 | 100줄 | 모듈 분리 |
| 설정 파일 | 300줄 | Factory 패턴 적용 |

---

## 10. 성과 측정 지표

### 10.1 코드 품질 지표

| 지표 | 현재 | Phase 1 | Phase 2 | Phase 4 |
|------|------|---------|---------|---------|
| ESLint 에러 | ? | 0 | 0 | 0 |
| ESLint 경고 | ? | <50 | <20 | <10 |
| 200줄 초과 파일 | 14 | 14 | 5 | 0 |
| 테스트 커버리지 | 0% | 0% | 30% | 70% |
| any 타입 사용 | ? | <30 | <10 | 0 |

### 10.2 성능 지표 (Web Vitals)

| 지표 | 목표 |
|------|------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTFB (Time to First Byte) | < 600ms |

### 10.3 번들 크기 목표

| 청크 | 현재 | 목표 |
|------|------|------|
| 메인 번들 | ? | < 200KB (gzipped) |
| 페이지별 청크 | ? | < 50KB (gzipped) |
| Tiptap 청크 | ? | < 150KB (lazy loaded) |

---

## 체크리스트

### Phase 1 (즉시)
- [ ] `src/shared/constants/config.ts` 생성
- [ ] `src/shared/constants/messages.ts` 생성
- [ ] 하드코딩된 값 상수로 교체 (10개 파일)
- [ ] ESLint 규칙 강화
- [ ] 네이밍 컨벤션 문서화

### Phase 2 (단기)
- [ ] simple-editor.tsx 분리
- [ ] InputListProvider.tsx 분리
- [ ] ProjectContext 생성
- [ ] useCallback/useMemo 최적화 (15개 위치)

### Phase 3 (중기)
- [ ] GraphQL Query Factory 구현
- [ ] Server/Client 경계 최적화
- [ ] 상태관리 재설계 (Zustand 검토)

### Phase 4 (장기)
- [ ] Vitest 설정
- [ ] 테스트 코드 작성 (커버리지 70%)
- [ ] Storybook 구축
- [ ] Web Vitals 모니터링 강화

---

## 참고 자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)
- [TanStack Query 모범 사례](https://tanstack.com/query/latest/docs/react/guides/best-practices)
- [Zustand 공식 문서](https://github.com/pmndrs/zustand)
- [Vitest 가이드](https://vitest.dev/guide/)
