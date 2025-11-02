# FormConfig 기반 GraphQL 통합 아키텍처 설계 문서

## 목차
1. [설계 철학](#설계-철학)
2. [아키텍처 개요](#아키텍처-개요)
3. [핵심 컴포넌트](#핵심-컴포넌트)
4. [데이터 흐름](#데이터-흐름)
5. [사용자 정의 쿼리 작성](#사용자-정의-쿼리-작성)
6. [타입 시스템](#타입-시스템)
7. [확장성](#확장성)

---

## 설계 철학

### 1. 사용자가 쿼리를 작성하고, 시스템은 매핑만 수행

**문제점**: 초기 설계에서는 `FormConfig`의 `columnInfo`를 기반으로 GraphQL 쿼리를 자동 생성하려 했습니다.
- 테이블 구조 추측 (ID 컬럼명, 관계 추론 등)
- 프라이머리 키가 단일인지 다중인지 불확실
- `profile_link`처럼 ID가 없는 테이블 처리 복잡
- 특정 테이블에 종속된 로직 발생

**해결책**: 사용자가 GraphQL 쿼리를 직접 작성하도록 변경
```typescript
export const profileConfig: FormConfig = {
  graphql: {
    read: `query GetProfile($owner: String!) { ... }`,
    insert: `mutation InsertProfile($objects: [...]) { ... }`,
    update: `mutation UpdateProfile($set: ...) { ... }`,
  },
  fields: [...]
};
```

**장점**:
- ✅ 완전한 범용성 - 어떤 테이블 구조든 지원
- ✅ 타입 안전성 - `database.types.ts`에 의존
- ✅ 명시적 - 쿼리가 무엇을 요청하는지 명확
- ✅ 유연성 - 복잡한 JOIN, 필터링, 정렬 등 자유롭게 작성

---

## 아키텍처 개요

### 레이어 구조

```
┌─────────────────────────────────────┐
│   React Component (Account.tsx)    │  ← 사용자 인터페이스
└────────────┬────────────────────────┘
             │ useFormConfigData Hook
             ↓
┌─────────────────────────────────────┐
│   useFormConfigData Hook            │  ← 상태 관리
│   - initialValues                   │
│   - isLoading, isSaving, error      │
│   - loadData(), saveData()          │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│   GraphQLDataService                │  ← 비즈니스 로직
│   - loadData()                      │     (쿼리 실행 + 매핑)
│   - saveData()                      │
└────────────┬────────────────────────┘
             │
             ├──────────────┬──────────────┐
             ↓              ↓              ↓
    ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
    │ QueryBuilder │ │ GraphQL     │ │ Data         │
    │              │ │ Client      │ │ Transformer  │
    │ - read 쿼리  │ │ - execute   │ │ - toForm     │
    │ - insert     │ │ - auth      │ │ - toGraphQL  │
    │ - update     │ │             │ │              │
    └──────────────┘ └─────────────┘ └──────────────┘
             │              │              │
             └──────────────┴──────────────┘
                           ↓
              ┌────────────────────────────┐
              │   Supabase GraphQL API     │
              └────────────────────────────┘
```

### 단일 진실 공급원 (Single Source of Truth)

**FormConfig**가 모든 것의 중심:
1. **UI 렌더링** - `fields` → `InputOfModal` 컴포넌트
2. **GraphQL 쿼리** - `graphql.read/insert/update`
3. **데이터 매핑** - `columnInfo` → Form ↔ GraphQL 변환

---

## 핵심 컴포넌트

### 1. FormConfig 타입 정의

**위치**: `src/app/components/modal/inputs/types/inputTypes.ts`

```typescript
export interface FormConfig {
  fields: FormFieldConfig[];

  // 사용자 정의 GraphQL 쿼리 (필수)
  graphql: {
    read: string;    // 데이터 조회
    insert: string;  // 데이터 삽입
    update: string;  // 데이터 업데이트
  };
}
```

**설계 이유**:
- `graphql` 필드를 **필수**로 만들어 명시성 확보
- 각 엔티티(profile, team, project)마다 고유한 쿼리 작성
- 시스템은 쿼리 내용을 추측하지 않음

### 2. GraphQL Client

**위치**: `src/utils/graphQL/client.ts`

```typescript
export class SupabaseGraphQLClient {
  private async execute<T>(query: string, variables?: Record<string, any>) {
    // 1. Supabase 세션 토큰 가져오기
    const { data: { session } } = await this.supabase.auth.getSession();

    // 2. GraphQL 요청
    const response = await fetch(this.graphqlEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ query, variables }),
    });

    // 3. 에러 처리
    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);

    return result;
  }
}
```

**핵심 로직**:
- Supabase 인증 토큰 자동 주입
- GraphQL 표준 형식으로 요청
- 에러를 TypeScript Error로 변환

### 3. Query Builder

**위치**: `src/utils/graphQL/queryBuilder.ts`

```typescript
// 단순히 FormConfig의 쿼리를 반환
export function buildReadQuery(formConfig: FormConfig): string {
  return formConfig.graphql.read;
}

export function buildInsertMutation(formConfig: FormConfig): string {
  return formConfig.graphql.insert;
}

export function buildUpdateMutation(formConfig: FormConfig): string {
  return formConfig.graphql.update;
}
```

**설계 결정**:
- 초기: 복잡한 쿼리 자동 생성 로직 (300+ 줄)
- 최종: 단순 반환 함수 (30줄)
- **이유**: 사용자가 쿼리를 작성하므로 추측 로직 불필요

### 4. Data Transformer

**위치**: `src/utils/graphQL/dataTransformer.ts`

#### GraphQL → Form 데이터 변환

```typescript
export function graphqlToFormData(
  graphqlData: any,
  formConfig: FormConfig
): Record<string, MultiInputItem[][] | string[] | boolean | File | null> {
  const formData = {};

  formConfig.fields.forEach((field) => {
    const { table, column } = field.columnInfo;

    if (field.type === 'inputList') {
      // GraphQL의 nested 데이터 → InputList 형식
      const relationData = graphqlData[`${table}Collection`]?.edges || [];
      formData[field.fieldName] = relationData.map(edge =>
        field.inputConfig.inputs.map(input => ({
          value: edge.node[input.name]
        }))
      );
    }

    if (field.type === 'skillTag') {
      // GraphQL의 skill_id → 스킬 이름 배열
      const skills = graphqlData[`${table}Collection`]?.edges || [];
      formData[field.fieldName] = skills.map(edge => edge.node.skill_name);
    }
  });

  return formData;
}
```

#### Form 데이터 → GraphQL Variables 변환

```typescript
export function formDataToGraphQL(
  formData: Record<string, any>,
  formConfig: FormConfig
): Record<string, any> {
  const variables = {};

  formConfig.fields.forEach((field) => {
    if (field.type === 'inputList') {
      // InputList → GraphQL mutation objects
      const items = formData[field.fieldName] as MultiInputItem[][];
      variables[field.fieldName] = items.map(item => {
        const obj = {};
        item.forEach((input, idx) => {
          obj[field.inputConfig.inputs[idx].name] = input.value;
        });
        return obj;
      });
    }
  });

  return variables;
}
```

**매핑 규칙**:
| Form Field Type | GraphQL Type | 변환 로직 |
|-----------------|--------------|-----------|
| `inputList` (onlyOne: true) | 단일 스칼라 값 | `[[{value: "foo"}]]` → `"foo"` |
| `inputList` (onlyOne: false) | 배열 | `[[{value: "a"}], [{value: "b"}]]` → `["a", "b"]` |
| `skillTag` | 배열 | `["React", "Node"]` → `[{skill_name: "React"}, ...]` |
| `picture` | 파일 URL | `File` → 스토리지 업로드 → `"url"` |
| `checkbox` | boolean | `true` → `true` |

### 5. GraphQLDataService

**위치**: `src/services/client/core/graphqlDataService.ts`

```typescript
export class GraphQLDataService {
  async loadData(
    formConfig: FormConfig,
    variables?: Record<string, any>
  ) {
    // 1. 사용자 정의 쿼리 가져오기
    const query = buildReadQuery(formConfig);

    // 2. 쿼리 실행
    const response = await executeQuery(query, variables);

    // 3. GraphQL 응답 → Form 데이터 매핑
    return graphqlToFormData(response, formConfig);
  }

  async saveData(
    formConfig: FormConfig,
    formData: Record<string, any>,
    variables?: Record<string, any>,
    isUpdate: boolean = false
  ) {
    // 1. Form 데이터 → GraphQL variables 변환
    const graphqlVariables = formDataToGraphQL(formData, formConfig);

    // 2. 사용자 정의 mutation 실행
    const mutation = isUpdate
      ? buildUpdateMutation(formConfig)
      : buildInsertMutation(formConfig);

    const response = await executeMutation(mutation, {
      ...graphqlVariables,
      ...variables
    });

    return { success: true, data: response };
  }
}
```

**핵심 책임**:
- ✅ 쿼리 실행 조율
- ✅ 데이터 변환 호출
- ❌ 쿼리 생성 (사용자가 함)
- ❌ 테이블 특화 로직 (없음)

### 6. useFormConfigData Hook

**위치**: `src/utils/hook/useFormConfigData.ts`

```typescript
export function useFormConfigData(
  formConfig: FormConfig,
  variables?: Record<string, any>,  // GraphQL variables
  options?: {
    autoLoad?: boolean;
    isUpdate?: boolean;
  }
) {
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const data = await dataService.loadData(formConfig, variables);
    setInitialValues(data);
    setIsLoading(false);
  }, [formConfig, variables]);

  const saveData = useCallback(async (formData) => {
    return await dataService.saveData(
      formConfig,
      formData,
      variables,
      options?.isUpdate
    );
  }, [formConfig, variables, options?.isUpdate]);

  return { initialValues, isLoading, error, saveData, loadData };
}
```

**상태 관리**:
- `initialValues` - React Hook Form에 전달할 초기값
- `isLoading` - 로딩 스피너 표시용
- `error` - 에러 메시지 표시용
- `saveData` - 폼 제출 핸들러

---

## 데이터 흐름

### 조회 (Read) 플로우

```
1. Component 렌더링
   ↓
2. useFormConfigData(profileConfig, { owner: userId })
   ↓
3. loadData() 자동 호출
   ↓
4. GraphQLDataService.loadData()
   ├─ buildReadQuery(profileConfig) → SQL 쿼리 문자열
   ├─ executeQuery(query, { owner: userId })
   │   └─ POST /graphql/v1 with auth token
   └─ graphqlToFormData(response, profileConfig)
       └─ FormConfig.fields 순회하며 매핑
   ↓
5. setInitialValues(mappedData)
   ↓
6. InputOfModal에 initialValues 전달
   ↓
7. 사용자에게 폼 표시
```

### 저장 (Save) 플로우

```
1. 사용자가 폼 제출
   ↓
2. handleSubmit(formData)
   ↓
3. saveData(formData)
   ↓
4. GraphQLDataService.saveData()
   ├─ formDataToGraphQL(formData, profileConfig)
   │   └─ FormConfig.fields 기반 변환
   ├─ buildInsertMutation(profileConfig) or buildUpdateMutation()
   ├─ executeMutation(mutation, variables)
   │   └─ POST /graphql/v1 with auth token
   └─ return { success: true }
   ↓
5. 성공 시 모달 닫기 / 실패 시 에러 표시
```

---

## 사용자 정의 쿼리 작성

### 1. Read Query 예시

```graphql
query GetProfile($owner: String!) {
  profileCollection(
    filter: {
      owner: { eq: $owner },
      is_team: { eq: false }
    }
  ) {
    edges {
      node {
        profile_id
        profile_name
        profile_image
        description

        # 관계 테이블 (One-to-Many)
        profile_linkCollection {
          edges {
            node {
              link
              alt
            }
          }
        }

        # 중간 테이블 (Many-to-Many)
        profile_skillsCollection {
          edges {
            node {
              skill_id
              skills {
                skill_name
              }
            }
          }
        }
      }
    }
  }
}
```

**주의사항**:
- Supabase GraphQL은 `Collection` suffix 사용
- 관계는 `edges { node { } }` 구조
- 필터는 `{ eq, neq, gt, lt, in, ... }` 연산자

### 2. Insert Mutation 예시

```graphql
mutation InsertProfile($objects: [profileInsertInput!]!) {
  insertIntoprofileCollection(objects: $objects) {
    affectedCount
    records {
      profile_id
      profile_name
    }
  }
}
```

**Variables 형식**:
```json
{
  "objects": [
    {
      "profile_name": "홍길동",
      "description": "개발자",
      "owner": "user-123",
      "is_team": false
    }
  ]
}
```

### 3. Update Mutation 예시

```graphql
mutation UpdateProfile(
  $set: profileUpdateInput!,
  $filter: profileFilter!
) {
  updateprofileCollection(set: $set, filter: $filter) {
    affectedCount
    records {
      profile_id
    }
  }
}
```

**Variables 형식**:
```json
{
  "set": {
    "profile_name": "홍길동",
    "description": "시니어 개발자"
  },
  "filter": {
    "profile_id": { "eq": "profile-123" }
  }
}
```

---

## 타입 시스템

### Supabase 타입 활용

```typescript
import { Database } from '@/utils/supabase/database.types';

// 테이블 Row 타입
type Profile = Database['public']['Tables']['profile']['Row'];

// Insert DTO
type ProfileInsert = Database['public']['Tables']['profile']['Insert'];

// Update DTO
type ProfileUpdate = Database['public']['Tables']['profile']['Update'];

// 사용 예시
const profile: Profile = {
  profile_id: 'xxx',
  profile_name: '홍길동',
  owner: 'user-123',
  is_team: false,
  // ... database.types.ts에 정의된 모든 필드
};
```

### ColumnInfo와 매핑

```typescript
{
  fieldName: 'profile_full_name',
  columnInfo: {
    table: 'profile',      // Database['public']['Tables']['profile']
    column: 'profile_name' // keyof Profile
  }
}
```

---

## 확장성

### 1. 새로운 엔티티 추가

**예시: Team Config**

```typescript
// src/services/config/teamConfig.ts
export const teamConfig: FormConfig = {
  graphql: {
    read: `
      query GetTeam($team_id: String!) {
        profileCollection(
          filter: { profile_id: { eq: $team_id }, is_team: { eq: true } }
        ) {
          edges {
            node {
              profile_id
              profile_name
              profile_image
              team_membersCollection {
                edges {
                  node {
                    user_id
                    role
                  }
                }
              }
            }
          }
        }
      }
    `,
    insert: `mutation InsertTeam(...) { ... }`,
    update: `mutation UpdateTeam(...) { ... }`,
  },
  fields: [
    {
      fieldName: 'team_name',
      label: '팀 이름',
      type: 'inputList',
      columnInfo: { table: 'profile', column: 'profile_name' },
      inputConfig: { ... }
    },
    // ...
  ]
};
```

**사용**:
```typescript
const { initialValues, saveData } = useFormConfigData(
  teamConfig,
  { team_id: 'team-123' }
);
```

### 2. 복잡한 쿼리 패턴

#### 페이지네이션
```graphql
query GetProfiles($first: Int!, $after: Cursor) {
  profileCollection(first: $first, after: $after) {
    edges {
      node { ... }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

#### 정렬
```graphql
query GetProfiles($orderBy: [profileOrderBy!]) {
  profileCollection(orderBy: $orderBy) {
    edges {
      node { ... }
    }
  }
}
```

#### 검색
```graphql
query SearchProfiles($search: String!) {
  profileCollection(
    filter: {
      profile_name: { ilike: $search }
    }
  ) {
    edges {
      node { ... }
    }
  }
}
```

### 3. 에러 처리 확장

```typescript
// Custom error handler
class GraphQLError extends Error {
  constructor(
    message: string,
    public code: string,
    public extensions?: Record<string, any>
  ) {
    super(message);
  }
}

// 사용
try {
  await saveData(formData);
} catch (error) {
  if (error instanceof GraphQLError) {
    if (error.code === 'UNIQUE_VIOLATION') {
      alert('이미 존재하는 프로필 이름입니다.');
    }
  }
}
```

---

## 설계 결정 및 트레이드오프

### ✅ 채택한 결정

| 결정 | 이유 |
|------|------|
| 사용자가 쿼리 작성 | 완전한 범용성, 명시성, 유연성 |
| FormConfig = 단일 진실 공급원 | UI + 데이터 + 쿼리를 한 곳에서 관리 |
| React Hook으로 캡슐화 | 상태 관리 단순화, 재사용성 |
| 데이터 변환 레이어 분리 | GraphQL ↔ Form 형식 변환 로직 격리 |

### ❌ 거부한 결정

| 거부한 설계 | 이유 |
|-------------|------|
| 자동 쿼리 생성 | 테이블 구조 추측 불가능, 복잡도 증가 |
| 테이블 특화 서비스 | 범용성 저하, 유지보수 어려움 |
| `column: '*'` 지원 | GraphQL은 필드를 명시해야 함 |
| ORM 패턴 | GraphQL과 맞지 않음, Over-engineering |

---

## 성능 고려사항

### 1. N+1 문제 방지

**나쁜 예**:
```graphql
query {
  profileCollection {
    edges {
      node {
        profile_id
        # N+1: 각 profile마다 별도 요청
      }
    }
  }
}

# 별도로
profileLinkCollection(filter: { profile_id: ... })
```

**좋은 예**:
```graphql
query {
  profileCollection {
    edges {
      node {
        profile_id
        # 한 번에 가져오기
        profile_linkCollection {
          edges {
            node {
              link
              alt
            }
          }
        }
      }
    }
  }
}
```

### 2. 필드 선택 최소화

```graphql
# ❌ 불필요한 데이터 가져오기
query {
  profileCollection {
    edges {
      node {
        # 100개 필드 전부
      }
    }
  }
}

# ✅ 필요한 것만
query {
  profileCollection {
    edges {
      node {
        profile_id
        profile_name
        # 화면에 표시할 것만
      }
    }
  }
}
```

### 3. 캐싱 전략

```typescript
// React Query 연동 예시
import { useQuery } from '@tanstack/react-query';

function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => dataService.loadData(profileConfig, { owner: userId }),
    staleTime: 5 * 60 * 1000, // 5분
  });
}
```

---

## 보안 고려사항

### 1. Row Level Security (RLS)

Supabase RLS 정책이 GraphQL에도 적용됩니다:

```sql
-- 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile"
ON profile FOR SELECT
USING (auth.uid() = owner);

-- 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile"
ON profile FOR UPDATE
USING (auth.uid() = owner);
```

### 2. Input Validation

```typescript
// GraphQL variables 검증
function validateProfileInput(data: any) {
  if (!data.profile_name || data.profile_name.length > 100) {
    throw new Error('Invalid profile name');
  }

  if (data.description && data.description.length > 1000) {
    throw new Error('Description too long');
  }
}
```

---

## 마이그레이션 가이드

### 기존 코드 → 새로운 시스템

**Before**:
```typescript
// 복잡한 변환 로직
const profileData = await getProfileWithDetails(userId);
const initialValues = transformDataToInitialValues(profileData, profileConfig);

// 복잡한 저장 로직
const saveData = transformFormDataToSaveFormat(formData, profileConfig, userId);
await saveProfileData(saveData, userId);
```

**After**:
```typescript
// 간단한 Hook 사용
const { initialValues, saveData } = useFormConfigData(
  profileConfig,
  { owner: userId }
);

// 저장
await saveData(formData);
```

**단계**:
1. `FormConfig`에 `graphql` 필드 추가
2. GraphQL 쿼리 작성 (Supabase Studio의 GraphiQL 활용)
3. 기존 API 호출 코드를 `useFormConfigData`로 교체
4. 테스트 후 기존 코드 제거

---

## 문제 해결

### GraphQL API 404 오류

**증상**: `ERR_FAILED` 또는 404 응답

**해결책**:
1. Supabase 프로젝트 설정에서 GraphQL API 활성화
2. 엔드포인트 확인: `https://<project-ref>.supabase.co/graphql/v1`
3. `NEXT_PUBLIC_SUPABASE_URL`에 trailing slash 없는지 확인

### 데이터 매핑 오류

**증상**: Form에 데이터가 표시되지 않음

**해결책**:
1. 콘솔에서 GraphQL 응답 구조 확인
2. `graphqlToFormData`의 매핑 로직 확인
3. `columnInfo`의 `table`, `column` 값이 올바른지 확인

### 인증 오류

**증상**: "No active session found"

**해결책**:
1. Supabase 로그인 상태 확인
2. `supabase.auth.getSession()` 호출 확인
3. 토큰 만료 여부 확인

---

## 요약

이 시스템의 핵심은 **"사용자가 쿼리를 작성하고, 시스템은 실행과 매핑만 수행"**하는 것입니다.

**시스템이 하는 일**:
- ✅ GraphQL 쿼리 실행
- ✅ 인증 토큰 주입
- ✅ GraphQL ↔ Form 데이터 매핑
- ✅ 에러 처리
- ✅ 로딩 상태 관리

**시스템이 하지 않는 일**:
- ❌ 쿼리 자동 생성
- ❌ 테이블 구조 추측
- ❌ 특정 엔티티에 종속된 로직

이를 통해 **완전한 범용성**과 **명시적인 코드**를 달성했습니다.
