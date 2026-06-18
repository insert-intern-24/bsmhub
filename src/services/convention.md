# Services 폴더 구조 컨벤션

## 개요

`services` 폴더는 모든 서비스 로직과 데이터 접근 계층을 관리합니다. Supabase, GraphQL, 그리고 비즈니스 로직 서비스들이 일관된 구조로 조직되어 있습니다.

## 폴더 구조

```
services/
├── auth/              # 인증 관련 서비스
├── config/            # 모달 설정 파일들
├── core/              # 핵심 서비스 (GraphQL 데이터 서비스 등)
├── graphQL/           # GraphQL 관련 유틸리티 및 클라이언트
├── portfolio/         # 포트폴리오 관련 서비스
├── profile/           # 프로필 관련 서비스
├── project/           # 프로젝트 관련 서비스
├── supabase/          # Supabase 클라이언트 및 유틸리티
└── team/              # 팀 관련 서비스
```

## 파일명 규칙

### 1. 실행 환경 구분

파일명에 실행 환경을 명시하여 클라이언트와 서버 코드를 구분합니다.

- **클라이언트 (브라우저)**: `.client.ts`
- **서버 (Node.js)**: `.server.ts`

예시:
- `profileApi.client.ts` - 클라이언트에서 실행되는 프로필 API
- `getProfile.server.ts` - 서버에서 실행되는 프로필 조회

### 2. 데이터 접근 방식 구분

GraphQL을 사용하는 파일은 `.graphql` 접미사를 추가합니다.

- **ORM 방식 (Supabase 직접 사용)**: 접미사 없음
- **GraphQL 방식**: `.graphql` 접미사 추가

### 3. 조합 규칙

실행 환경과 데이터 접근 방식을 조합할 때는 다음 순서를 따릅니다:

```
{파일명}.graphql.{환경}.ts
```

예시:
- `client.graphql.client.ts` - 클라이언트용 GraphQL 클라이언트
- `client.graphql.server.ts` - 서버용 GraphQL 클라이언트
- `graphqlDataService.graphql.client.ts` - 클라이언트용 GraphQL 데이터 서비스

### 4. 타입 파일

타입 정의 파일은 접미사 없이 유지합니다.

- `database.types.ts` - Supabase 데이터베이스 타입
- `types.graphql.ts` - GraphQL 관련 타입

## Supabase 파일 구조

### 위치
`services/supabase/`

### 파일 목록
- `client.ts` - 브라우저용 Supabase 클라이언트
- `server.ts` - 서버용 Supabase 클라이언트
- `middleware.server.ts` - Next.js 미들웨어용 Supabase 세션 관리
- `database.types.ts` - 데이터베이스 타입 정의
- `imageHostConverter.ts` - 이미지 URL 변환 유틸리티

### 사용 예시

```typescript
// 클라이언트에서
import { createClient } from '@/services/supabase/client';

// 서버에서
import { createClient } from '@/services/supabase/server';
```

## GraphQL 파일 구조

### 위치
`services/graphQL/`

### 파일 목록
- `client.graphql.client.ts` - 클라이언트용 GraphQL 클라이언트
- `client.graphql.server.ts` - 서버용 GraphQL 클라이언트
- `queryBuilder.graphql.ts` - GraphQL 쿼리 빌더
- `dataTransformer.graphql.ts` - 데이터 변환 유틸리티
- `form-config-utils.graphql.ts` - 폼 설정 유틸리티
- `metadataExtractor.graphql.ts` - 메타데이터 추출
- `relationTableHelper.graphql.ts` - 관계 테이블 처리 헬퍼
- `types.graphql.ts` - GraphQL 타입 정의

### 사용 예시

```typescript
// 클라이언트에서
import { executeQuery, executeMutation } from '@/services/graphQL/client.graphql.client';

// 서버에서
import { executeQueryServer, executeMutationServer } from '@/services/graphQL/client.graphql.server';
```

## 서비스 파일 구조

### 도메인별 조직

서비스 파일들은 도메인별로 폴더를 구성합니다:
- `auth/` - 인증
- `portfolio/` - 포트폴리오
- `profile/` - 프로필
- `project/` - 프로젝트
- `team/` - 팀

### 파일명 예시

#### ORM 방식 (Supabase 직접 사용)
- `getProfile.server.ts` - 서버에서 프로필 조회
- `getProfileApi.client.ts` - 클라이언트에서 프로필 API 호출
- `saveProfile.client.ts` - 클라이언트에서 프로필 저장
- `uploadProfileImage.client.ts` - 클라이언트에서 이미지 업로드
- `checkProfileIsTeam.server.ts` - 서버에서 프로필 팀 여부 확인
- `getAccount.server.ts` - 서버에서 계정 정보 조회

#### GraphQL 방식
- `dataService.graphql.client.ts` - 클라이언트용 GraphQL 데이터 서비스

## Import 경로 규칙

### 절대 경로 사용

모든 import는 `@/` 별칭을 사용한 절대 경로를 사용합니다.

```typescript
// ✅ 올바른 예시
import { createClient } from '@/services/supabase/client';
import { createClient } from '@/services/supabase/server';
import { executeQuery } from '@/services/graphQL/client.graphql.client';
import { getProfile } from '@/services/profile/getProfile.server';

// ❌ 잘못된 예시
import { createClient } from '../../../utils/supabase/client';
import { executeQuery } from '../graphQL/client';
```

### 파일 확장자

TypeScript 파일을 import할 때는 확장자를 생략합니다.

```typescript
// ✅ 올바른 예시
import { createClient } from '@/services/supabase/client';
import { createClient } from '@/services/supabase/server';

// ❌ 잘못된 예시
import { createClient } from '@/services/supabase/client.ts';
```

## 새 서비스 파일 작성 가이드

### 1. 실행 환경 결정
- 클라이언트에서만 사용? → `.client.ts`
- 서버에서만 사용? → `.server.ts`
- 양쪽에서 사용? → 각각 별도 파일 생성

### 2. 데이터 접근 방식 결정
- Supabase ORM 사용? → 접미사 없음
- GraphQL 사용? → `.graphql` 접미사 추가

### 3. 파일명 작성

**기본 패턴**: `{action}{Entity}{Detail?}.{graphql?}.{client|server}.ts`

#### CRUD 작업
- **Read**: `get{Entity}{Detail?}.{env}.ts`
  - 예: `getProfile.server.ts`, `getProfileDetail.server.ts`, `getAccount.server.ts`
- **Create**: `create{Entity}.{env}.ts`
- **Update**: `update{Entity}.{env}.ts`
- **Delete**: `delete{Entity}.{env}.ts`
- **Save (Create+Update)**: `save{Entity}.{env}.ts`
  - 예: `saveProfile.client.ts`

#### 특수 작업
- **Check/Validate**: `check{Entity}{Condition}.{env}.ts`
  - 예: `checkProfileIsTeam.server.ts`
- **Upload**: `upload{Entity}Image.{env}.ts`
  - 예: `uploadProfileImage.client.ts`
- **API 집합**: `get{Entity}Api.{env}.ts`
  - 예: `getProfileApi.client.ts`

#### GraphQL 서비스
- **데이터 서비스**: `{entity}DataService.graphql.{env}.ts`
  - 예: `dataService.graphql.client.ts`

예시:
- `getProfile.server.ts` - 서버, ORM 방식
- `saveProfile.client.ts` - 클라이언트, ORM 방식
- `dataService.graphql.client.ts` - 클라이언트, GraphQL 방식

### 4. 적절한 폴더에 배치
- 도메인별 폴더가 있으면 해당 폴더에 배치
- 범용 서비스는 `core/` 폴더에 배치

## 주의사항

1. **타입 파일은 접미사 없음**: `database.types.ts`, `types.graphql.ts` 등
2. **설정 파일은 접미사 없음**: `profileConfig.ts` 등
3. **유틸리티 파일은 접미사 없음**: `imageHostConverter.ts` 등
4. **일관성 유지**: 같은 패턴을 프로젝트 전체에 일관되게 적용

## 예외 사항

- `config/` 폴더의 파일들은 모달 설정 파일이므로 접미사 없이 유지
- 공유 타입 정의 파일은 접미사 없이 유지
- 순수 유틸리티 함수는 접미사 없이 유지

