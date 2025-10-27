# GraphQL Apollo Client 설정 가이드

이 프로젝트는 Supabase와 Apollo Client를 사용한 GraphQL 설정이 완료되었습니다.

## 설정된 파일들

1. **codegen.ts** - GraphQL Code Generator 설정
2. **src/lib/apollo.ts** - Apollo Client 설정
3. **src/app/providers.tsx** - Apollo Provider 연결
4. **src/components/TodoList.tsx** - 예제 컴포넌트

## 사용 방법

### 1. 환경 변수 설정 ✅

`.env.local` 파일이 이미 설정되어 있습니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bsmhubsp.obtuse.kr/
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. GraphQL 스키마 URL 업데이트 ✅

`codegen.ts` 파일이 실제 Supabase 프로젝트 URL로 설정되었습니다:

```typescript
schema: 'https://bsmhubsp.obtuse.kr/graphql/v1',
```

### 3. 타입 생성

```bash
npm run codegen
```

### 4. 테스트 페이지 확인 ✅

`/graphql-test` 페이지에서 실제 GraphQL 쿼리가 작동하는 것을 확인할 수 있습니다:

- 프로필 목록 조회
- 프로젝트 목록 조회

### 5. GraphQL 쿼리 사용

```typescript
import { useQuery } from '@apollo/client'
import { graphql } from '@/gql'

const MyQuery = graphql(/* GraphQL */ `
  query MyQuery {
    // 실제 쿼리 작성
  }
`)

const MyComponent = () => {
  const { data, loading, error } = useQuery(MyQuery)
  // 컴포넌트 로직
}
```

## 주요 기능

- ✅ Apollo Client 설정 완료
- ✅ GraphQL Code Generator 설정 완료
- ✅ 타입 안전성 보장
- ✅ 인증 토큰 자동 처리
- ✅ Relay 스타일 페이지네이션 지원
- ✅ 캐시 최적화 설정
- ✅ 실제 데이터 조회 테스트 완료
- ✅ 프로필 및 프로젝트 쿼리 작동 확인

## 참고 자료

- [Supabase GraphQL 가이드](https://supabase.com/docs/guides/graphql/with-apollo)
- [Apollo Client 문서](https://www.apollographql.com/docs/react/)
- [GraphQL Code Generator 문서](https://the-guild.dev/graphql/codegen)
