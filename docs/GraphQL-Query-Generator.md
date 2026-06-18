# GraphQL 쿼리 생성기 및 FormConfig 연동 시스템

## 개요

이 시스템은 FormConfig 설정을 기반으로 자동으로 GraphQL 쿼리를 생성하는 도구입니다. 데이터베이스 테이블 간의 관계를 분석하여 중첩된 GraphQL selection 구조를 자동으로 생성합니다.

## 주요 기능

- 📝 **FormConfig 기반 쿼리 생성**: 폼 설정에서 자동으로 GraphQL 쿼리 생성
- 🔗 **테이블 관계 분석**: 데이터베이스 테이블 간 foreign key 관계 자동 분석
- 🌳 **중첩 구조 생성**: 관계를 기반으로 중첩된 GraphQL selection 구조 생성
- ⚡ **자동화**: 수동으로 쿼리를 작성할 필요 없이 설정만으로 쿼리 생성

## 설치 및 설정

### 1. 필요한 파일들

```
src/utils/graphQL/
├── form-config-utils.ts          # FormConfig 유틸리티 함수들
├── generateGraphQLQuery.ts       # GraphQL 쿼리 생성기
├── form-to-graphql-example.ts    # 사용 예시
└── *.test.ts                     # 테스트 파일들
```

### 2. 타입 정의

```typescript
// ColumnInfo 타입
interface ColumnInfo {
  table: string;    // 테이블명
  column: string;   // 컬럼명
}

// FormConfig에 추가된 속성
interface BaseFieldConfig {
  label: string;
  required?: boolean;
  fieldName: string;
  columnInfo?: ColumnInfo; // 새로 추가된 속성
}
```

## 사용법

### 1. 기본 사용법

```typescript
import { generateGraphQLQuery, ColumnInfo } from '@/utils/graphQL/generateGraphQLQuery';

// 컬럼 정보 정의
const columns: ColumnInfo[] = [
  { table: "chat_messages", column: "content" },
  { table: "chat_messages", column: "created_at" },
  { table: "conversations", column: "conversation_title" }
];

// GraphQL 쿼리 생성
const query = generateGraphQLQuery(columns);
console.log(query);
```

**생성되는 쿼리:**
```graphql
{
  chat_messages {
    content
    created_at
    conversation_id
    conversations {
      conversation_title
    }
  }
}
```

### 2. FormConfig와 연동 사용법

#### 2.1 FormConfig 정의

```typescript
import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';

const formConfig: FormConfig = {
  fields: [
    {
      fieldName: 'profiles.full_name',
      label: '이름',
      type: 'inputList',
      required: true,
      columnInfo: { table: 'profile', column: 'profile_name' }, // 중요!
      inputConfig: {
        onlyOne: true,
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: '이름을 입력하세요',
            required: true
          }
        ]
      }
    },
    {
      fieldName: 'profiles.avatar_url',
      label: '프로필 이미지',
      type: 'picture',
      required: false,
      columnInfo: { table: 'profile', column: 'profile_image' }, // 중요!
      aspectRatio: '1:1'
    }
  ]
};
```

#### 2.2 FormConfig에서 쿼리 생성

```typescript
import { getColumnInfoArray } from '@/utils/graphQL/form-config-utils';
import { generateGraphQLQuery } from '@/utils/graphQL/generateGraphQLQuery';

// FormConfig에서 ColumnInfo 추출
const columnInfoArray = getColumnInfoArray(formConfig);

// GraphQL 쿼리 생성
const query = generateGraphQLQuery(columnInfoArray);
console.log(query);
```

**생성되는 쿼리:**
```graphql
{
  profile {
    profile_name
    profile_image
  }
}
```

### 3. 고급 사용법

#### 3.1 특정 필드의 ColumnInfo 조회

```typescript
import { getColumnInfoByFieldName } from '@/utils/graphQL/form-config-utils';

const nameColumnInfo = getColumnInfoByFieldName(formConfig, 'profiles.full_name');
console.log(nameColumnInfo); // { table: 'profile', column: 'profile_name' }
```

#### 3.2 전체 ColumnInfo 매칭 객체 조회

```typescript
import { extractColumnInfoFromFormConfig } from '@/utils/graphQL/form-config-utils';

const columnInfoMap = extractColumnInfoFromFormConfig(formConfig);
console.log(columnInfoMap);
// {
//   "profiles.full_name": { table: 'profile', column: 'profile_name' },
//   "profiles.avatar_url": { table: 'profile', column: 'profile_image' }
// }
```

## API 레퍼런스

### generateGraphQLQuery

```typescript
function generateGraphQLQuery(columns: ColumnInfo[]): string
```

**매개변수:**
- `columns`: 쿼리 생성을 위한 컬럼 정보 배열

**반환값:**
- 생성된 GraphQL 쿼리 문자열

**예시:**
```typescript
const columns = [
  { table: "projects", column: "project_name" },
  { table: "profile", column: "profile_name" }
];
const query = generateGraphQLQuery(columns);
```

### extractColumnInfoFromFormConfig

```typescript
function extractColumnInfoFromFormConfig(formConfig: FormConfig): Record<string, ColumnInfo>
```

**매개변수:**
- `formConfig`: 폼 설정 객체

**반환값:**
- 필드명을 키로 하고 ColumnInfo를 값으로 하는 객체

**예시:**
```typescript
const columnInfoMap = extractColumnInfoFromFormConfig(formConfig);
// { "field1": { table: "table1", column: "column1" } }
```

### getColumnInfoArray

```typescript
function getColumnInfoArray(formConfig: FormConfig): ColumnInfo[]
```

**매개변수:**
- `formConfig`: 폼 설정 객체

**반환값:**
- ColumnInfo 배열

**예시:**
```typescript
const columnInfoArray = getColumnInfoArray(formConfig);
// [{ table: "table1", column: "column1" }, ...]
```

### getColumnInfoByFieldName

```typescript
function getColumnInfoByFieldName(formConfig: FormConfig, fieldName: string): ColumnInfo | undefined
```

**매개변수:**
- `formConfig`: 폼 설정 객체
- `fieldName`: 조회할 필드명

**반환값:**
- 해당 필드의 ColumnInfo 또는 undefined

**예시:**
```typescript
const columnInfo = getColumnInfoByFieldName(formConfig, 'profiles.full_name');
// { table: 'profile', column: 'profile_name' }
```

## 실제 사용 예시

### 프로필 폼에서 GraphQL 쿼리 생성

```typescript
import { profileConfig } from '@/services/config/profileConfig';
import { getColumnInfoArray } from '@/utils/graphQL/form-config-utils';
import { generateGraphQLQuery } from '@/utils/graphQL/generateGraphQLQuery';

// 프로필 설정에서 쿼리 생성
function createProfileQuery() {
  const columnInfoArray = getColumnInfoArray(profileConfig);
  const query = generateGraphQLQuery(columnInfoArray);
  
  console.log('프로필 GraphQL 쿼리:', query);
  return query;
}

// 사용
const profileQuery = createProfileQuery();
```

### 동적 폼에서 쿼리 생성

```typescript
function createDynamicQuery(formConfig: FormConfig) {
  // FormConfig에서 ColumnInfo 추출
  const columnInfoArray = getColumnInfoArray(formConfig);
  
  // 중복 제거 (같은 테이블의 컬럼들을 그룹화)
  const uniqueColumns = Array.from(
    new Set(columnInfoArray.map(col => `${col.table}.${col.column}`))
  ).map(str => {
    const [table, column] = str.split('.');
    return { table, column };
  });
  
  // GraphQL 쿼리 생성
  const query = generateGraphQLQuery(uniqueColumns);
  
  return query;
}
```

## 테스트

### 테스트 실행

```bash
# GraphQL 쿼리 생성기 테스트
npx tsx src/utils/graphQL/generateGraphQLQuery.test.ts

# FormConfig 연동 테스트
npx tsx src/utils/graphQL/form-config-utils.test.ts
```

### 테스트 결과 예시

```
🚀 GraphQL 쿼리 생성기 테스트 시작

📝 테스트 1: Chat Messages 예시
==================================================
{
  chat_messages {
    content
    created_at
    conversation_id
    conversations {
      conversation_title
    }
  }
}

🎉 모든 테스트 완료!
```

## 지원되는 테이블 관계

현재 시스템에서 지원하는 주요 테이블 관계:

- `chat_messages` → `conversations`
- `projects` → `profile`
- `community_posts` → `profile`

## 제한사항

1. **하드코딩된 관계**: 현재는 주요 테이블 관계만 하드코딩으로 지원
2. **N:N 관계**: 아직 완전히 지원되지 않음
3. **복잡한 조인**: 기본 foreign key 관계만 처리

## 확장 가능성

### 새로운 테이블 관계 추가

`generateGraphQLQuery.ts`의 `extractTableRelationships` 함수에서 새로운 관계를 추가할 수 있습니다:

```typescript
function extractTableRelationships(): Map<string, any[]> {
  const relationships = new Map<string, any[]>();
  
  // 새로운 관계 추가
  relationships.set('new_table', [
    {
      foreignKeyName: "new_table_foreign_key",
      columns: ["foreign_key_column"],
      referencedRelation: "referenced_table",
      referencedColumns: ["referenced_column"]
    }
  ]);
  
  return relationships;
}
```

### 자동 관계 감지

향후 database.types.ts 파일을 파싱하여 자동으로 관계를 감지하는 기능을 추가할 수 있습니다.

## 문제 해결

### 자주 발생하는 문제

1. **ColumnInfo가 undefined인 경우**
   - FormConfig의 각 필드에 `columnInfo` 속성이 제대로 설정되었는지 확인

2. **테이블 관계가 인식되지 않는 경우**
   - `extractTableRelationships` 함수에 해당 관계가 정의되어 있는지 확인

3. **Import 오류**
   - 파일 경로가 올바른지 확인
   - TypeScript 설정에서 path alias가 제대로 설정되었는지 확인

## 라이선스

MIT License
