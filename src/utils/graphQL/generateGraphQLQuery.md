# 자동 GraphQL 쿼리 생성기

데이터베이스 스키마 정보를 기반으로 GraphQL 쿼리를 자동 생성하는 시스템입니다.

## 기능

- `database.types.ts` 파일을 파싱하여 테이블 구조와 관계 정보를 자동 추출
- 컬럼 정보를 입력받아 테이블 간 관계를 분석
- 관계를 기반으로 중첩된 GraphQL selection 구조를 자동 생성
- 복잡한 다중 테이블 관계도 재귀적으로 처리
- **FormConfig와 연동하여 폼 설정에서 자동으로 GraphQL 쿼리 생성**

## 설치 및 사용법

### 1. 기본 사용법

```typescript
import { generateGraphQLQuery } from './src/utils/graphql-query-generator';
import { ColumnInfo } from './src/utils/graphql-query-generator';

// 쿼리 생성을 위한 컬럼 정보 정의
const columns: ColumnInfo[] = [
  { table: "chat_messages", column: "content" },
  { table: "chat_messages", column: "created_at" },
  { table: "chat_messages", column: "conversation_id" },
  { table: "conversations", column: "conversation_title" }
];

// GraphQL 쿼리 생성
const query = generateGraphQLQuery(columns);
console.log(query);
```

### 2. FormConfig와 연동 사용법

```typescript
import { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { getColumnInfoArray } from '@/utils/form-config-utils';
import { generateGraphQLQuery } from '@/utils/graphql-query-generator';

// FormConfig 정의 (ColumnInfo 포함)
const formConfig: FormConfig = {
  fields: [
    {
      fieldName: 'profiles.full_name',
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
    },
    {
      fieldName: 'profiles.avatar_url',
      label: '프로필 이미지',
      type: 'picture',
      required: false,
      columnInfo: { table: 'profile', column: 'profile_image' },
      aspectRatio: '1:1'
    }
  ]
};

// FormConfig에서 ColumnInfo 추출
const columnInfoArray = getColumnInfoArray(formConfig);

// GraphQL 쿼리 생성
const query = generateGraphQLQuery(columnInfoArray);
console.log(query);
```

### 3. 생성되는 쿼리 예시

입력된 컬럼 정보에 따라 다음과 같은 GraphQL 쿼리가 생성됩니다:

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

### 4. 테스트 실행

```bash
# 기본 테스트
npx tsx src/utils/graphql-query-generator/test.ts

# FormConfig 연동 테스트
npx tsx src/utils/test-form-config.ts
```

## API 레퍼런스

### generateGraphQLQuery

```typescript
generateGraphQLQuery(columns: ColumnInfo[]): string
```
- `columns`: 쿼리 생성을 위한 컬럼 정보 배열
- 반환값: 생성된 GraphQL 쿼리 문자열

### FormConfig 유틸리티 함수들

#### extractColumnInfoFromFormConfig
```typescript
extractColumnInfoFromFormConfig(formConfig: FormConfig): Record<string, ColumnInfo>
```
- FormConfig에서 각 필드의 ColumnInfo를 추출하여 매칭 객체를 생성

#### getColumnInfoArray
```typescript
getColumnInfoArray(formConfig: FormConfig): ColumnInfo[]
```
- FormConfig에서 ColumnInfo 배열을 추출

#### getColumnInfoByFieldName
```typescript
getColumnInfoByFieldName(formConfig: FormConfig, fieldName: string): ColumnInfo | undefined
```
- 특정 필드명에 해당하는 ColumnInfo를 가져옴

### ColumnInfo 타입
```typescript
interface ColumnInfo {
  table: string;    // 테이블명
  column: string;   // 컬럼명
}
```

### FormConfig에 ColumnInfo 추가

FormConfig의 각 필드에 `columnInfo` 속성을 추가할 수 있습니다:

```typescript
{
  fieldName: 'profiles.full_name',
  label: '이름',
  type: 'inputList',
  required: true,
  columnInfo: { table: 'profile', column: 'profile_name' }, // 추가된 부분
  inputConfig: {
    // ... 기존 설정
  }
}
```

## 예시

### 1. 채팅 메시지와 대화방 정보
```typescript
const columns: ColumnInfo[] = [
  { table: "chat_messages", column: "content" },
  { table: "chat_messages", column: "created_at" },
  { table: "conversations", column: "conversation_title" }
];
```

### 2. 프로젝트와 프로필 정보
```typescript
const columns: ColumnInfo[] = [
  { table: "projects", column: "project_name" },
  { table: "projects", column: "description" },
  { table: "profile", column: "profile_name" },
  { table: "profile", column: "profile_image" }
];
```

### 3. 복잡한 다중 관계
```typescript
const columns: ColumnInfo[] = [
  { table: "community_posts", column: "context" },
  { table: "profile", column: "profile_name" },
  { table: "departments", column: "department_name" }
];
```

## 특징

- **자동 관계 분석**: 테이블 간 foreign key 관계를 자동으로 분석
- **중첩 구조 생성**: 관계에 따라 자동으로 중첩된 selection 구조 생성
- **재귀적 처리**: 복잡한 다중 테이블 관계도 재귀적으로 처리
- **GraphQL 표준 준수**: 생성되는 쿼리는 GraphQL 표준 문법을 준수
- **FormConfig 연동**: 폼 설정에서 자동으로 GraphQL 쿼리 생성 가능

## 제한사항

- 현재는 주요 테이블 관계만 하드코딩으로 지원
- N:N 관계는 아직 완전히 지원되지 않음
- 복잡한 조인 조건은 기본 foreign key 관계만 처리

## 라이선스

MIT License
