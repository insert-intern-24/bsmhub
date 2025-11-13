# 컴포넌트 컨벤션

## 개요

`components` 폴더는 모든 React 컴포넌트를 관리합니다. UI 컴포넌트들이 일관된 구조와 네이밍 규칙을 따르도록 합니다.

## 폴더 구조

```
components/
├── auth/              # 인증 관련 컴포넌트
├── card/              # 카드 컴포넌트
│   ├── portfolio/     # 포트폴리오 카드
│   ├── project/       # 프로젝트 카드
│   └── root/          # 루트 카드
├── collect/           # 수집 관련 컴포넌트
├── contents/          # 콘텐츠 컴포넌트
├── dropdown/          # 드롭다운 컴포넌트
├── layout/            # 레이아웃 컴포넌트
├── modal/             # 모달 컴포넌트
│   └── inputs/        # 입력 컴포넌트
├── project/           # 프로젝트 관련 컴포넌트
├── system/            # 시스템 컴포넌트
└── ...
```

## 파일명 규칙

### 1. PascalCase 사용

모든 컴포넌트 파일명은 PascalCase를 사용합니다.

예시:
- `ProfileEditButton.tsx` ✅
- `ProjectCard.tsx` ✅
- `EditButton.tsx` ✅
- `profileEditButton.tsx` ❌
- `edit-button.tsx` ❌

### 2. 컴포넌트명과 파일명 일치

컴포넌트명과 파일명은 일치해야 합니다.

```typescript
// ProfileEditButton.tsx
const ProfileEditButton = () => { ... };
export default ProfileEditButton;
```

## 컴포넌트 정의 규칙

### 1. 함수형 컴포넌트 사용

모든 컴포넌트는 함수형 컴포넌트로 작성합니다.

```typescript
// ✅ 올바른 예시
const MyComponent = () => {
  return <div>...</div>;
};

// ❌ 잘못된 예시
class MyComponent extends React.Component { ... }
```

### 2. Export 방식

컴포넌트는 `const`로 정의하고 `export default`로 내보냅니다.

```typescript
// ✅ 올바른 예시
const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {
  return <div>...</div>;
};

export default MyComponent;

// ❌ 잘못된 예시
export default function MyComponent() { ... }
export const MyComponent = () => { ... };
```

### 3. Named Export 사용

여러 컴포넌트를 내보내는 경우에만 named export를 사용합니다.

```typescript
// ✅ 올바른 예시 (여러 컴포넌트)
export const ComponentA = () => { ... };
export const ComponentB = () => { ... };

// ✅ 올바른 예시 (단일 컴포넌트)
const MyComponent = () => { ... };
export default MyComponent;
```

## Props 규칙

### 1. Props 인터페이스 네이밍

Props 인터페이스는 `{ComponentName}Props` 형식을 따릅니다.

```typescript
// ✅ 올바른 예시
interface ProfileEditButtonProps {
  ownerId: string;
}

const ProfileEditButton = ({ ownerId }: ProfileEditButtonProps) => {
  ...
};

// ❌ 잘못된 예시
interface Props { ... }
interface ProfileEditButton { ... }
type ProfileEditButtonProps = { ... } // interface를 우선 사용
```

### 2. Props 정의 위치

Props 인터페이스는 컴포넌트 파일 내부, 컴포넌트 정의 바로 위에 위치합니다.

```typescript
// ✅ 올바른 예시
interface MyComponentProps {
  prop1: string;
  prop2?: number;
}

const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {
  ...
};
```

**예외**: 여러 컴포넌트에서 공유되는 타입은 별도 `types.ts` 파일에 정의합니다.

```typescript
// card/portfolio/types.ts
export interface PortfolioCardProps {
  profile: Profile;
  projects: Project[];
}

// card/portfolio/PortfolioCard.tsx
import { PortfolioCardProps } from './types';
```

### 3. Props 순서

Props는 다음 순서로 정의합니다:

1. **Required props** (필수 속성)
2. **Optional props** (선택 속성)
   - 데이터 props (초기값, 설정 등)
   - 스타일 props (className, style 등)
   - 이벤트 핸들러 props (onClick, onChange 등)

```typescript
// ✅ 올바른 예시
interface EditButtonProps {
  // Required props
  config: FormConfig;
  variables: Record<string, unknown>;
  
  // Optional data props
  mode?: 'create' | 'update';
  ownerId?: string;
  isTeam?: boolean;
  initialTags?: number[];
  
  // Optional style props
  className?: string;
  gap?: number;
  
  // Optional event handlers
  onTagsChange?: (tags: number[]) => void;
  onClick?: () => void;
}

// ❌ 잘못된 예시 (순서가 일관되지 않음)
interface EditButtonProps {
  className?: string;
  config: FormConfig;
  onClick?: () => void;
  variables: Record<string, unknown>;
}
```

### 4. Optional Props 표시

선택적 props는 `?`를 사용하여 표시합니다.

```typescript
// ✅ 올바른 예시
interface MyComponentProps {
  requiredProp: string;
  optionalProp?: number;
}

// ❌ 잘못된 예시
interface MyComponentProps {
  requiredProp: string;
  optionalProp: number | undefined;
}
```

### 5. Props 타입 명시

모든 props는 명시적으로 타입을 정의합니다.

```typescript
// ✅ 올바른 예시
interface MyComponentProps {
  name: string;
  age: number;
  isActive: boolean;
  items: string[];
  config: FormConfig;
}

// ❌ 잘못된 예시
interface MyComponentProps {
  name: any;
  age: unknown;
}
```

## 컴포넌트 구조

### 1. 기본 구조

```typescript
'use client'; // 클라이언트 컴포넌트인 경우에만

import React from 'react';
import { ... } from '...';

interface MyComponentProps {
  // props 정의
}

const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {
  // hooks
  // handlers
  // render
  return <div>...</div>;
};

export default MyComponent;
```

### 2. 'use client' 지시어

클라이언트에서만 실행되는 컴포넌트는 파일 최상단에 `'use client'`를 추가합니다.

```typescript
// ✅ 클라이언트 컴포넌트
'use client';

import { useState } from 'react';

const MyComponent = () => {
  const [state, setState] = useState(0);
  ...
};

// ✅ 서버 컴포넌트 (기본값)
import { ... } from '...';

const MyComponent = () => {
  ...
};
```

### 3. Import 순서

Import는 다음 순서로 정리합니다:

1. React 및 Next.js 관련
2. 외부 라이브러리
3. 내부 컴포넌트
4. 내부 유틸리티/서비스
5. 타입 정의

```typescript
// 1. React 및 Next.js
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 2. 외부 라이브러리
import { IconPencil } from '@tabler/icons-react';

// 3. 내부 컴포넌트
import ProfileEditModal from './ProfileEditModal';
import { useModal } from '@/app/components/modal';

// 4. 내부 유틸리티/서비스
import { useCurrentUser } from '@/utils/hook/useCurrentUser';
import { checkProfileExistence } from '@/services/profile/getProfileApi.client';

// 5. 타입 정의
import type { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
```

## 서브 컴포넌트

### 1. 서브 컴포넌트 위치

컴포넌트의 서브 컴포넌트는 `components/` 폴더에 배치합니다.

```
card/
└── portfolio/
    ├── PortfolioCard.tsx
    └── components/
        ├── ProfileInfo.tsx
        ├── StatusBadge.tsx
        └── ProjectImages.tsx
```

### 2. 서브 컴포넌트 네이밍

서브 컴포넌트도 동일한 네이밍 규칙을 따릅니다.

```typescript
// components/ProfileInfo.tsx
interface ProfileInfoProps {
  profile: Profile;
  layout?: 'vertical' | 'horizontal';
}

const ProfileInfo = ({ profile, layout }: ProfileInfoProps) => {
  ...
};

export default ProfileInfo;
```

## 재사용 가능한 컴포넌트

### 1. 공통 컴포넌트 추출

중복되는 로직이나 UI는 공통 컴포넌트로 추출합니다.

예시: `ProfileEditButton`과 `TeamProfileEditButton` → `EditButton`으로 통합

```typescript
// ✅ 공통 컴포넌트
interface EditButtonProps {
  config: FormConfig;
  variables: Record<string, unknown>;
  // ... 공통 props
}

const EditButton = ({ ... }: EditButtonProps) => {
  ...
};

// ✅ 특화된 래퍼 컴포넌트
const ProfileEditButton = ({ ownerId }: ProfileEditButtonProps) => {
  return (
    <EditButton
      config={profileConfig}
      variables={{ owner: ownerId }}
      ...
    />
  );
};
```

## 타입 정의

### 1. 컴포넌트별 타입

컴포넌트에서만 사용되는 타입은 컴포넌트 파일 내부에 정의합니다.

```typescript
// MyComponent.tsx
interface MyComponentProps {
  data: MyData;
}

interface MyData {
  id: string;
  name: string;
}

const MyComponent = ({ data }: MyComponentProps) => {
  ...
};
```

### 2. 공유 타입

여러 컴포넌트에서 사용되는 타입은 별도 `types.ts` 파일에 정의합니다.

```typescript
// card/portfolio/types.ts
export interface Profile {
  name: string;
  role: string[];
  status: string;
  profile_image: string;
}

export interface PortfolioCardProps {
  profile: Profile;
  projects: Project[];
}
```

## 주의사항

1. **일관성 유지**: 모든 컴포넌트는 동일한 규칙을 따릅니다.
2. **Props 순서**: Required props → Optional props 순서를 지킵니다.
3. **타입 안정성**: 모든 props는 명시적으로 타입을 정의합니다.
4. **Export 방식**: 단일 컴포넌트는 `export default`를 사용합니다.
5. **파일명과 컴포넌트명 일치**: 파일명과 컴포넌트명은 동일해야 합니다.

## 예외 사항

- 시스템 컴포넌트(`system/`)는 여러 컴포넌트를 named export로 내보낼 수 있습니다.
- 공유 타입이 많은 경우 별도 `types.ts` 파일 사용을 권장합니다.
- 매우 작은 유틸리티 컴포넌트는 파일명을 소문자로 시작할 수 있습니다 (예: `text.tsx`).

