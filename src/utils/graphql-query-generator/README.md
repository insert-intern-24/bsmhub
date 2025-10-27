# 자동 GraphQL 쿼리 생성기

데이터베이스 스키마 정보를 기반으로 GraphQL 쿼리를 자동 생성하는 시스템입니다.

## 기능

- `database.types.ts` 파일을 파싱하여 테이블 구조와 관계 정보를 자동 추출
- 컬럼 정보를 입력받아 테이블 간 관계를 분석
- 관계를 기반으로 중첩된 GraphQL selection 구조를 자동 생성
- 복잡한 다중 테이블 관계도 재귀적으로 처리

## 설치 및 사용법

### 1. 기본 사용법

```typescript
import { AutoGraphQLQueryGenerator } from './src/utils/graphql-query-generator';
import { ColumnInfo } from './src/utils/graphql-query-generator/types';

// database.types.ts 파일 내용을 읽어옵니다
const databaseTypesContent = fs.readFileSync('src/utils/supabase/database.types.ts', 'utf-8');

// 쿼리 생성기 인스턴스 생성
const generator = new AutoGraphQLQueryGenerator(databaseTypesContent);

// 쿼리 생성을 위한 컬럼 정보 정의
const columns: ColumnInfo[] = [
  { table: "chat_messages", column: "content" },
  { table: "chat_messages", column: "created_at" },
  { table: "chat_messages", column: "conversation_id" },
  { table: "conversations", column: "conversation_title" }
];

// GraphQL 쿼리 생성
const query = generator.generateQuery(columns);
console.log(query);
```

### 2. 생성되는 쿼리 예시

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

### 3. 테스트 실행

```bash
# 테스트 스크립트 실행
npx tsx src/utils/graphql-query-generator/test.ts
```

## API 레퍼런스

### AutoGraphQLQueryGenerator

#### 생성자
```typescript
constructor(databaseTypesContent: string)
```
- `databaseTypesContent`: database.types.ts 파일의 전체 내용

#### 메서드
```typescript
generateQuery(columns: ColumnInfo[]): string
```
- `columns`: 쿼리 생성을 위한 컬럼 정보 배열
- 반환값: 생성된 GraphQL 쿼리 문자열

### ColumnInfo 타입
```typescript
interface ColumnInfo {
  table: string;    // 테이블명
  column: string;   // 컬럼명
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
  { table: "profiles", column: "name" },
  { table: "profiles", column: "student_number" }
];
```

### 3. 복잡한 다중 관계
```typescript
const columns: ColumnInfo[] = [
  { table: "community_posts", column: "context" },
  { table: "profiles", column: "name" },
  { table: "departments", column: "department_name" }
];
```

## 특징

- **자동 관계 분석**: 테이블 간 foreign key 관계를 자동으로 분석
- **중첩 구조 생성**: 관계에 따라 자동으로 중첩된 selection 구조 생성
- **재귀적 처리**: 복잡한 다중 테이블 관계도 재귀적으로 처리
- **GraphQL 표준 준수**: 생성되는 쿼리는 GraphQL 표준 문법을 준수

## 제한사항

- 현재는 Supabase의 database.types.ts 파일 형식만 지원
- N:N 관계는 아직 완전히 지원되지 않음
- 복잡한 조인 조건은 기본 foreign key 관계만 처리

## 라이선스

MIT License
