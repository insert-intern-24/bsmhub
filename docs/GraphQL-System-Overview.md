# GraphQL 쿼리 생성기 시스템 전체 개요

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                    GraphQL 쿼리 생성기 시스템                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   FormConfig    │───▶│  ColumnInfo     │                │
│  │   (폼 설정)      │    │  (컬럼 정보)     │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           ▼                       ▼                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              FormConfig 유틸리티 함수들                    │ │
│  │  • extractColumnInfoFromFormConfig                     │ │
│  │  • getColumnInfoArray                                   │ │
│  │  • getColumnInfoByFieldName                            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                              │
│                              ▼                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              GraphQL 쿼리 생성기                        │ │
│  │  • generateGraphQLQuery                                │ │
│  │  • 테이블 관계 분석                                      │ │
│  │  • 중첩 구조 생성                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                              │
│                              ▼                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              생성된 GraphQL 쿼리                         │ │
│  │  {                                                      │ │
│  │    table_name {                                         │ │
│  │      column1                                            │ │
│  │      column2                                            │ │
│  │      related_table {                                    │ │
│  │        related_column                                   │ │
│  │      }                                                  │ │
│  │    }                                                    │ │
│  │  }                                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 핵심 컴포넌트

### 1. FormConfig 시스템

**위치:** `src/app/components/modal/inputs/types/inputTypes.ts`

**기능:**
- 폼 필드의 설정을 정의하는 구조체
- 각 필드에 `columnInfo` 속성을 추가하여 데이터베이스 매핑 정보 제공

**주요 타입:**
```typescript
interface FormConfig {
  fields: FormFieldConfig[];
}

interface BaseFieldConfig {
  label: string;
  required?: boolean;
  fieldName: string;
  columnInfo?: ColumnInfo; // 새로 추가된 속성
}
```

### 2. GraphQL 쿼리 생성기

**위치:** `src/utils/graphQL/generateGraphQLQuery.ts`

**기능:**
- ColumnInfo 배열을 받아서 GraphQL 쿼리 문자열 생성
- 테이블 간 관계를 분석하여 중첩된 구조 생성
- 재귀적으로 복잡한 관계 처리

**핵심 함수:**
```typescript
function generateGraphQLQuery(columns: ColumnInfo[]): string
```

### 3. FormConfig 유틸리티

**위치:** `src/utils/graphQL/form-config-utils.ts`

**기능:**
- FormConfig에서 ColumnInfo 추출
- 필드명과 컬럼 정보 매칭
- 자동 fallback 처리

**주요 함수:**
- `extractColumnInfoFromFormConfig()`
- `getColumnInfoArray()`
- `getColumnInfoByFieldName()`

## 데이터 흐름

### 1단계: FormConfig 정의

```typescript
const formConfig: FormConfig = {
  fields: [
    {
      fieldName: 'profiles.name',
      label: '이름',
      type: 'inputList',
      columnInfo: { table: 'profile', column: 'profile_name' },
      inputConfig: { /* ... */ }
    }
  ]
};
```

### 2단계: ColumnInfo 추출

```typescript
const columnInfoArray = getColumnInfoArray(formConfig);
// [{ table: 'profile', column: 'profile_name' }]
```

### 3단계: GraphQL 쿼리 생성

```typescript
const query = generateGraphQLQuery(columnInfoArray);
// {
//   profile {
//     profile_name
//   }
// }
```

## 지원되는 기능

### ✅ 현재 지원

1. **기본 테이블 관계**
   - `chat_messages` → `conversations`
   - `projects` → `profile`
   - `community_posts` → `profile`

2. **FormConfig 필드 타입**
   - `inputList`
   - `picture`
   - `skillTag`
   - `checkbox`

3. **자동 fallback**
   - `columnInfo`가 없으면 `fieldName`에서 자동 추출

4. **중첩 구조 생성**
   - 테이블 관계를 기반으로 자동 중첩

### 🔄 확장 가능

1. **새로운 테이블 관계**
   - `extractTableRelationships()` 함수에 추가

2. **새로운 필드 타입**
   - `BaseFieldConfig`를 상속하여 구현

3. **자동 관계 감지**
   - database.types.ts 파싱을 통한 자동 관계 감지

## 사용 시나리오

### 시나리오 1: 프로필 폼 쿼리 생성

```typescript
// 프로필 폼 설정
const profileFormConfig: FormConfig = {
  fields: [
    {
      fieldName: 'profiles.name',
      label: '이름',
      type: 'inputList',
      columnInfo: { table: 'profile', column: 'profile_name' },
      inputConfig: { /* ... */ }
    },
    {
      fieldName: 'profiles.avatar',
      label: '프로필 이미지',
      type: 'picture',
      columnInfo: { table: 'profile', column: 'profile_image' },
      aspectRatio: '1:1'
    }
  ]
};

// 쿼리 생성
const columnInfoArray = getColumnInfoArray(profileFormConfig);
const query = generateGraphQLQuery(columnInfoArray);
```

### 시나리오 2: 동적 필드 선택

```typescript
function createQueryForFields(formConfig: FormConfig, fieldNames: string[]) {
  const columnInfoArray = fieldNames
    .map(fieldName => getColumnInfoByFieldName(formConfig, fieldName))
    .filter(Boolean);
  
  return generateGraphQLQuery(columnInfoArray);
}

// 사용
const query = createQueryForFields(formConfig, [
  'profiles.name',
  'profiles.avatar'
]);
```

### 시나리오 3: 복잡한 관계 처리

```typescript
const complexColumns: ColumnInfo[] = [
  { table: "projects", column: "project_name" },
  { table: "projects", column: "description" },
  { table: "profile", column: "profile_name" },
  { table: "profile", column: "profile_image" }
];

const query = generateGraphQLQuery(complexColumns);
// {
//   projects {
//     project_name
//     description
//     profile {
//       profile_name
//       profile_image
//     }
//   }
// }
```

## 성능 특성

### 시간 복잡도

- **테이블 그룹화**: O(n) - n은 컬럼 수
- **관계 분석**: O(m) - m은 테이블 수
- **쿼리 생성**: O(d) - d는 관계 깊이

### 메모리 사용량

- **ColumnInfo 배열**: O(n)
- **테이블 관계 Map**: O(m)
- **처리된 테이블 Set**: O(m)

## 확장 계획

### 단기 계획

1. **더 많은 테이블 관계 추가**
2. **에러 처리 개선**
3. **성능 최적화**

### 장기 계획

1. **자동 관계 감지**
   - database.types.ts 파싱
   - 런타임 관계 분석

2. **고급 쿼리 기능**
   - 필터링 조건
   - 정렬 옵션
   - 페이지네이션

3. **타입 안전성 강화**
   - 제네릭 타입 지원
   - 컴파일 타임 검증

## 테스트 전략

### 단위 테스트

```typescript
// generateGraphQLQuery.test.ts
describe('generateGraphQLQuery', () => {
  it('should generate correct query for chat messages', () => {
    const columns = [
      { table: "chat_messages", column: "content" },
      { table: "conversations", column: "conversation_title" }
    ];
    
    const query = generateGraphQLQuery(columns);
    expect(query).toContain('chat_messages');
    expect(query).toContain('conversations');
  });
});
```

### 통합 테스트

```typescript
// form-config-utils.test.ts
describe('FormConfig integration', () => {
  it('should extract column info from form config', () => {
    const formConfig = createTestFormConfig();
    const columnInfoArray = getColumnInfoArray(formConfig);
    
    expect(columnInfoArray).toHaveLength(2);
    expect(columnInfoArray[0]).toEqual({ table: 'profile', column: 'profile_name' });
  });
});
```

## 배포 및 유지보수

### 배포 체크리스트

- [ ] 모든 테스트 통과
- [ ] TypeScript 컴파일 오류 없음
- [ ] 문서 업데이트 완료
- [ ] 성능 테스트 완료

### 유지보수 가이드

1. **새로운 테이블 관계 추가**
   - `extractTableRelationships()` 함수 수정
   - 테스트 케이스 추가

2. **새로운 필드 타입 추가**
   - `BaseFieldConfig` 상속
   - 타입 정의 업데이트

3. **성능 최적화**
   - 프로파일링 실행
   - 병목 지점 식별
   - 최적화 적용

이 시스템을 통해 FormConfig 기반의 자동 GraphQL 쿼리 생성이 가능하며, 확장성과 유지보수성을 고려한 설계로 구성되어 있습니다.
