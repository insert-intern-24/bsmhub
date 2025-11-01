# GraphQL 쿼리 생성기 API 레퍼런스

## 개요

이 문서는 GraphQL 쿼리 생성기와 FormConfig 연동 시스템의 모든 API를 상세히 설명합니다.

## Core API

### generateGraphQLQuery

GraphQL 쿼리를 자동 생성하는 핵심 함수입니다.

```typescript
function generateGraphQLQuery(columns: ColumnInfo[]): string
```

**매개변수:**
- `columns: ColumnInfo[]` - 쿼리 생성을 위한 컬럼 정보 배열

**반환값:**
- `string` - 생성된 GraphQL 쿼리 문자열

**예시:**
```typescript
import { generateGraphQLQuery, ColumnInfo } from '@/utils/graphQL/generateGraphQLQuery';

const columns: ColumnInfo[] = [
  { table: "chat_messages", column: "content" },
  { table: "chat_messages", column: "created_at" },
  { table: "conversations", column: "conversation_title" }
];

const query = generateGraphQLQuery(columns);
console.log(query);
// {
//   chat_messages {
//     content
//     created_at
//     conversations {
//       conversation_title
//     }
//   }
// }
```

**동작 원리:**
1. 컬럼 정보를 테이블별로 그룹화
2. 테이블 간 관계 분석
3. 메인 테이블 찾기 (가장 많은 관계를 가진 테이블)
4. 재귀적으로 중첩된 GraphQL 쿼리 생성

## FormConfig 유틸리티 API

### extractColumnInfoFromFormConfig

FormConfig에서 각 필드의 ColumnInfo를 추출하여 매칭 객체를 생성합니다.

```typescript
function extractColumnInfoFromFormConfig(formConfig: FormConfig): Record<string, ColumnInfo>
```

**매개변수:**
- `formConfig: FormConfig` - 폼 설정 객체

**반환값:**
- `Record<string, ColumnInfo>` - 필드명을 키로 하고 ColumnInfo를 값으로 하는 객체

**예시:**
```typescript
import { extractColumnInfoFromFormConfig } from '@/utils/graphQL/form-config-utils';

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

const columnInfoMap = extractColumnInfoFromFormConfig(formConfig);
console.log(columnInfoMap);
// {
//   "profiles.name": { table: 'profile', column: 'profile_name' }
// }
```

**자동 fallback:**
- `columnInfo`가 명시적으로 설정되지 않은 경우, `fieldName`에서 자동으로 추출
- `fieldName`이 "테이블명.컬럼명" 형식이어야 함

### getColumnInfoArray

FormConfig에서 ColumnInfo 배열을 추출합니다.

```typescript
function getColumnInfoArray(formConfig: FormConfig): ColumnInfo[]
```

**매개변수:**
- `formConfig: FormConfig` - 폼 설정 객체

**반환값:**
- `ColumnInfo[]` - ColumnInfo 배열

**예시:**
```typescript
import { getColumnInfoArray } from '@/utils/graphQL/form-config-utils';

const columnInfoArray = getColumnInfoArray(formConfig);
console.log(columnInfoArray);
// [
//   { table: 'profile', column: 'profile_name' },
//   { table: 'profile', column: 'profile_image' }
// ]

// GraphQL 쿼리 생성에 바로 사용 가능
const query = generateGraphQLQuery(columnInfoArray);
```

### getColumnInfoByFieldName

특정 필드명에 해당하는 ColumnInfo를 가져옵니다.

```typescript
function getColumnInfoByFieldName(formConfig: FormConfig, fieldName: string): ColumnInfo | undefined
```

**매개변수:**
- `formConfig: FormConfig` - 폼 설정 객체
- `fieldName: string` - 조회할 필드명

**반환값:**
- `ColumnInfo | undefined` - 해당 필드의 ColumnInfo 또는 undefined

**예시:**
```typescript
import { getColumnInfoByFieldName } from '@/utils/graphQL/form-config-utils';

const nameColumnInfo = getColumnInfoByFieldName(formConfig, 'profiles.name');
console.log(nameColumnInfo); // { table: 'profile', column: 'profile_name' }

const nonExistentColumnInfo = getColumnInfoByFieldName(formConfig, 'non.existent');
console.log(nonExistentColumnInfo); // undefined
```

## 타입 정의

### ColumnInfo

```typescript
interface ColumnInfo {
  table: string;    // 테이블명
  column: string;   // 컬럼명
}
```

**사용 예시:**
```typescript
const columnInfo: ColumnInfo = {
  table: 'profile',
  column: 'profile_name'
};
```

### FormConfig

```typescript
interface FormConfig {
  fields: FormFieldConfig[];
}

interface BaseFieldConfig {
  label: string;
  required?: boolean;
  fieldName: string;
  columnInfo?: ColumnInfo; // GraphQL 쿼리 생성을 위한 컬럼 정보
}
```

**사용 예시:**
```typescript
const formConfig: FormConfig = {
  fields: [
    {
      fieldName: 'profiles.name',
      label: '이름',
      type: 'inputList',
      required: true,
      columnInfo: { table: 'profile', column: 'profile_name' },
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
    }
  ]
};
```

## 내부 함수들

### extractTableRelationships

테이블 관계 정보를 정의하는 내부 함수입니다.

```typescript
function extractTableRelationships(): Map<string, any[]>
```

**반환값:**
- `Map<string, any[]>` - 테이블명을 키로 하고 관계 정보 배열을 값으로 하는 Map

**현재 지원하는 관계:**
- `chat_messages` → `conversations`
- `projects` → `profile`
- `community_posts` → `profile`

**새로운 관계 추가:**
```typescript
function extractTableRelationships(): Map<string, any[]> {
  const relationships = new Map<string, any[]>();
  
  // 기존 관계들...
  
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

### generateTableQuery

테이블 쿼리를 재귀적으로 생성하는 내부 함수입니다.

```typescript
function generateTableQuery(
  tableName: string, 
  tableColumns: Map<string, string[]>, 
  relationships: Map<string, any[]>,
  processedTables: Set<string>
): string
```

**매개변수:**
- `tableName: string` - 테이블명
- `tableColumns: Map<string, string[]>` - 테이블별 컬럼 정보
- `relationships: Map<string, any[]>` - 테이블 관계 정보
- `processedTables: Set<string>` - 이미 처리된 테이블들

**반환값:**
- `string` - 생성된 테이블 쿼리 문자열

## 사용 패턴

### 패턴 1: 기본 사용법

```typescript
import { generateGraphQLQuery, ColumnInfo } from '@/utils/graphQL/generateGraphQLQuery';

const columns: ColumnInfo[] = [
  { table: "projects", column: "project_name" },
  { table: "projects", column: "description" },
  { table: "profile", column: "profile_name" }
];

const query = generateGraphQLQuery(columns);
```

### 패턴 2: FormConfig 연동

```typescript
import { getColumnInfoArray } from '@/utils/graphQL/form-config-utils';
import { generateGraphQLQuery } from '@/utils/graphQL/generateGraphQLQuery';

const columnInfoArray = getColumnInfoArray(formConfig);
const query = generateGraphQLQuery(columnInfoArray);
```

### 패턴 3: 선택적 필드

```typescript
import { getColumnInfoByFieldName } from '@/utils/graphQL/form-config-utils';

const selectedFields = ['profiles.name', 'profiles.avatar'];
const columnInfoArray = selectedFields
  .map(fieldName => getColumnInfoByFieldName(formConfig, fieldName))
  .filter(Boolean);

const query = generateGraphQLQuery(columnInfoArray);
```

### 패턴 4: 동적 쿼리 생성

```typescript
function createDynamicQuery(formConfig: FormConfig, includeFields?: string[]) {
  let columnInfoArray: ColumnInfo[];
  
  if (includeFields) {
    // 특정 필드만 포함
    columnInfoArray = includeFields
      .map(fieldName => getColumnInfoByFieldName(formConfig, fieldName))
      .filter(Boolean);
  } else {
    // 모든 필드 포함
    columnInfoArray = getColumnInfoArray(formConfig);
  }
  
  return generateGraphQLQuery(columnInfoArray);
}
```

## 오류 처리

### 일반적인 오류

1. **ColumnInfo가 undefined인 경우**
   ```typescript
   const columnInfo = getColumnInfoByFieldName(formConfig, 'non.existent');
   if (!columnInfo) {
     console.error('필드를 찾을 수 없습니다.');
     return;
   }
   ```

2. **빈 배열 전달**
   ```typescript
   const emptyColumns: ColumnInfo[] = [];
   const query = generateGraphQLQuery(emptyColumns);
   // 빈 쿼리 생성됨: "{\n}"
   ```

3. **존재하지 않는 테이블 관계**
   ```typescript
   const columns: ColumnInfo[] = [
     { table: "non_existent_table", column: "column" }
   ];
   const query = generateGraphQLQuery(columns);
   // 관계가 없는 경우 단순한 쿼리 생성됨
   ```

## 성능 고려사항

### 메모리 사용량

- `extractTableRelationships()` 함수는 매번 새로운 Map을 생성합니다
- 대량의 FormConfig를 처리할 때는 결과를 캐싱하는 것을 고려하세요

### 처리 속도

- 테이블 관계 분석은 O(n) 시간 복잡도를 가집니다
- 복잡한 중첩 구조는 재귀적으로 처리되므로 깊이에 따라 성능이 달라집니다

## 확장성

### 새로운 테이블 관계 추가

```typescript
// generateGraphQLQuery.ts 파일 수정
function extractTableRelationships(): Map<string, any[]> {
  const relationships = new Map<string, any[]>();
  
  // 기존 관계들...
  
  // 새로운 관계 추가
  relationships.set('your_table', [
    {
      foreignKeyName: "your_table_foreign_key",
      columns: ["foreign_key_column"],
      referencedRelation: "referenced_table",
      referencedColumns: ["referenced_column"]
    }
  ]);
  
  return relationships;
}
```

### 커스텀 쿼리 생성기

```typescript
function createCustomQueryGenerator(customRelationships: Map<string, any[]>) {
  return function generateCustomQuery(columns: ColumnInfo[]): string {
    // 커스텀 로직 구현
    // ...
  };
}
```

이 API 레퍼런스를 통해 GraphQL 쿼리 생성기와 FormConfig 연동 시스템을 효과적으로 활용할 수 있습니다.
