# FormConfig 기반 범용 GraphQL 통합 가이드

## 개요

이 시스템은 `FormConfig`를 단일 진실 공급원(Single Source of Truth)으로 사용하여 자동으로 GraphQL 쿼리를 생성하고 데이터를 관리합니다.

## 핵심 장점

1. **완전 자동화**: FormConfig만 정의하면 CRUD 작업이 자동으로 처리됩니다
2. **타입 안전성**: Supabase의 타입 시스템을 활용합니다 (`Tables<'profile'>`, `Insert`, `Update` 등)
3. **범용성**: Profile, Team, Project 등 모든 엔티티에 동일하게 사용 가능
4. **선언적 코드**: 복잡한 데이터 변환 로직을 작성할 필요가 없습니다

## 아키텍처

```
FormConfig (단일 진실 공급원)
    ↓
useFormConfigData Hook (React)
    ↓
GraphQLDataService (비즈니스 로직)
    ↓
QueryBuilder + Client (GraphQL 통신)
    ↓
Supabase GraphQL API
```

## 주요 파일 구조

```
src/
├── utils/
│   ├── graphQL/
│   │   ├── metadataExtractor.ts    # FormConfig에서 메타데이터 추출
│   │   ├── queryBuilder.ts         # GraphQL 쿼리 자동 생성
│   │   ├── client.ts               # GraphQL 클라이언트
│   │   └── dataTransformer.ts      # 데이터 변환 (GraphQL ↔ Form)
│   └── hook/
│       └── useFormConfigData.ts    # 범용 데이터 관리 Hook
├── services/
│   ├── client/
│   │   ├── core/
│   │   │   └── graphqlDataService.ts  # 범용 데이터 서비스
│   │   └── profile/
│   │       └── profileGraphQLService.ts  # 프로필 특화 래퍼
│   └── config/
│       └── profileConfig.ts        # FormConfig 정의
└── examples/
    └── ProfileEditExample.tsx      # 사용 예시
```

## 사용 방법

### 1. FormConfig 정의

```typescript
// src/services/config/profileConfig.ts
export const profileConfig: FormConfig = {
  fields: [
    {
      fieldName: 'profile_full_name',
      label: '이름',
      type: 'inputList',
      required: true,
      columnInfo: { table: 'profile', column: 'profile_name' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          { name: 'name', type: 'text', placeholder: '이름을 입력하세요', required: true }
        ]
      }
    },
    {
      fieldName: 'profile_link',
      label: '링크',
      type: 'inputList',
      required: false,
      columnInfo: { table: 'profile_link', column: '*' },
      inputConfig: {
        onlyOne: false,
        inputs: [
          { name: 'link', type: 'text', placeholder: 'URL', required: true },
          { name: 'alt', type: 'text', placeholder: '제목', required: true }
        ]
      }
    },
    {
      fieldName: 'profile_skills',
      label: '기술스택',
      type: 'skillTag',
      required: false,
      columnInfo: { table: 'profile_skills', column: '*' }
    }
  ]
};
```

### 2. 컴포넌트에서 사용

#### 방법 A: Hook 직접 사용 (권장)

```typescript
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import { profileConfig } from '@/services/config/profileConfig';
import InputOfModal from '@/app/components/modal/inputs/InputOfModal';

function ProfileEditModal() {
  const userId = 'current-user-id'; // 실제로는 auth에서 가져옴

  // 범용 Hook 사용
  const { initialValues, isLoading, saveData, error } = useFormConfigData(
    profileConfig,
    { owner: userId }, // 필터 조건 (데이터 로드용)
    {
      userId: userId,  // owner로 설정될 사용자 ID
      autoLoad: true   // 자동 로드 (기본값: true)
    }
  );

  const handleSubmit = async (formData: any) => {
    const result = await saveData(formData);

    if (result.success) {
      alert('저장 성공!');
    } else {
      alert(`오류: ${result.message}`);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <InputOfModal
      title="프로필 편집"
      config={profileConfig}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}
```

#### 방법 B: 특화 서비스 사용

```typescript
import { getProfileGraphQLService } from '@/services/client/profile/profileGraphQLService';

async function saveProfile() {
  const service = getProfileGraphQLService();

  const result = await service.saveProfileData(
    formData,
    userId,
    profileId // 업데이트인 경우
  );

  if (result.success) {
    console.log('저장 성공!', result.data);
  }
}
```

### 3. 새로운 엔티티 추가하기

#### 예시: Team Config 만들기

```typescript
// src/services/config/teamConfig.ts
export const teamConfig: FormConfig = {
  fields: [
    {
      fieldName: 'team_name',
      label: '팀 이름',
      type: 'inputList',
      required: true,
      columnInfo: { table: 'profile', column: 'profile_name' },
      inputConfig: {
        onlyOne: true,
        inputs: [
          { name: 'name', type: 'text', placeholder: '팀 이름', required: true }
        ]
      }
    },
    {
      fieldName: 'team_members',
      label: '팀원',
      type: 'inputList',
      required: false,
      columnInfo: { table: 'team_members', column: '*' },
      inputConfig: {
        onlyOne: false,
        inputs: [
          { name: 'member_id', type: 'text', placeholder: '멤버 ID', required: true }
        ]
      }
    }
  ]
};
```

#### 팀 편집 컴포넌트

```typescript
function TeamEditModal({ teamId }: { teamId: string }) {
  const { initialValues, isLoading, saveData } = useFormConfigData(
    teamConfig,
    { team_id: teamId },
    { userId: currentUserId }
  );

  // 나머지는 프로필과 동일!
  return (
    <InputOfModal
      config={teamConfig}
      initialValues={initialValues}
      onSubmit={saveData}
    />
  );
}
```

## API 레퍼런스

### useFormConfigData Hook

```typescript
function useFormConfigData(
  formConfig: FormConfig,
  filter?: Record<string, any>,
  options?: {
    autoLoad?: boolean;    // 자동으로 데이터 로드 (기본: true)
    recordId?: string;     // 업데이트할 레코드 ID
    userId?: string;       // 사용자 ID (owner 등)
  }
): {
  initialValues: Record<string, any>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveData: (formData: any) => Promise<Result>;
  reloadData: () => void;
  loadData: () => Promise<void>;
}
```

### GraphQLDataService

```typescript
class GraphQLDataService {
  // 데이터 로드
  loadData(
    formConfig: FormConfig,
    filter?: Record<string, any>
  ): Promise<Record<string, any>>;

  // 데이터 저장 (Insert or Update)
  saveData(
    formConfig: FormConfig,
    formData: Record<string, any>,
    recordId?: string,
    userId?: string
  ): Promise<Result>;
}
```

## ColumnInfo 규칙

### 메인 테이블 컬럼
```typescript
columnInfo: { table: 'profile', column: 'profile_name' }
```

### 관계 테이블 (모든 컬럼)
```typescript
columnInfo: { table: 'profile_link', column: '*' }
```

### 중첩 관계 (예: certificates.certificate_name)
```typescript
{
  fieldName: 'student_certificates',
  columnInfo: { table: 'student_certificates', column: '*' },
  inputConfig: {
    inputs: [
      { name: 'certificates.certificate_name', type: 'text' }
    ]
  }
}
```

## 데이터 흐름

### 로드 (Load)
1. `useFormConfigData` Hook이 `loadData` 호출
2. `GraphQLDataService`가 `buildReadQuery`로 쿼리 생성
3. GraphQL Client가 Supabase에 요청
4. `graphqlToFormData`가 응답을 React Hook Form 형식으로 변환
5. `initialValues`로 폼에 전달

### 저장 (Save)
1. 폼 제출 시 `saveData` 호출
2. `formDataToGraphQL`이 폼 데이터를 GraphQL 형식으로 변환
3. `GraphQLDataService`가 Insert/Update 판단
4. 메인 테이블 저장 후 관계 테이블 처리
5. 결과 반환

## 관계 테이블 처리

### One-to-Many 관계
- 예: profile → profile_link (하나의 프로필, 여러 링크)
- `onlyOne: false`로 설정
- 저장 시 기존 데이터 삭제 후 재삽입

### 중간 테이블 (Junction Table)
- 예: profile_skills (profile ↔ skills)
- skill_name으로 skill_id 자동 조회/생성
- upsert로 중복 방지

## 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 마이그레이션 가이드

### 기존 코드 (Before)

```typescript
// 복잡한 데이터 변환 로직
const profileData = await getProfileWithDetails(userId);
const initialValues = transformDataToInitialValues(profileData, profileConfig);

// 복잡한 저장 로직
const saveData = transformFormDataToSaveFormat(formData, profileConfig, userId);
const result = await saveProfileData(saveData, userId);
```

### 새로운 코드 (After)

```typescript
// Hook 하나로 모든 것 해결
const { initialValues, saveData } = useFormConfigData(
  profileConfig,
  { owner: userId },
  { userId }
);

// 그냥 호출
const result = await saveData(formData);
```

## 주의사항

1. **GraphQL 엔드포인트 활성화**: Supabase 프로젝트에서 GraphQL API가 활성화되어 있어야 합니다
2. **인증 필요**: GraphQL 요청은 Supabase 세션 토큰이 필요합니다
3. **RLS 정책**: Supabase의 Row Level Security 정책이 GraphQL에도 적용됩니다
4. **네이밍 규칙**: 테이블명과 컬럼명은 snake_case를 사용해야 합니다

## 트러블슈팅

### "No active session found" 오류
- Supabase 인증이 필요합니다
- `supabase.auth.getSession()`이 유효한 세션을 반환하는지 확인

### GraphQL 쿼리 오류
- `src/utils/graphQL/testQueries.ts`로 생성된 쿼리 확인
- Supabase Studio의 GraphiQL에서 직접 테스트

### 관계 데이터가 로드되지 않음
- `columnInfo: { table: 'xxx', column: '*' }` 설정 확인
- 테이블명이 `{parent}_{relation}` 형식인지 확인 (예: `profile_link`)

## 다음 단계

1. ✅ 프로필 편집 리팩토링 완료
2. 🔲 팀 생성/편집 기능 추가
3. 🔲 프로젝트 생성/편집 기능 추가
4. 🔲 이미지 업로드 처리 개선
5. 🔲 낙관적 업데이트(Optimistic Update) 지원

## 참고 자료

- [Supabase GraphQL API 문서](https://supabase.com/docs/guides/graphql)
- [React Hook Form 문서](https://react-hook-form.com/)
- FormConfig 타입 정의: `src/app/components/modal/inputs/types/inputTypes.ts`
