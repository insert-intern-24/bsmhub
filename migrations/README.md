# Contest 기능 데이터베이스 마이그레이션

이 디렉토리는 Contest(대회) 기능을 위한 데이터베이스 마이그레이션 스크립트를 포함합니다.

## 📋 개요

Contest 기능은 다음을 지원합니다:
- 선생님(web_admin)이 대회를 생성하고 관리
- 프로젝트를 대회에 등록
- 한 프로젝트가 여러 대회에 참가 가능 (N:M 관계)
- 대회 소유자는 profile이 아닌 auth.uid로 직접 관리

## 🗂️ 테이블 구조

### 1. `contest` 테이블
대회 정보를 저장하는 메인 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| contest_id | bigserial | 대회 고유 ID (PK) |
| contest_name | text | 대회 이름 |
| description | text | 대회 설명 |
| contest_image | text | 대회 썸네일 이미지 URL |
| owner | uuid | 대회 주최자 (auth.uid) |
| start_date | timestamp | 대회 시작일 |
| end_date | timestamp | 대회 종료일 |
| status | smallint | 대회 상태 (0: 예정, 1: 진행중, 2: 종료) |
| created_at | timestamp | 생성일시 |
| updated_at | timestamp | 수정일시 (자동 업데이트) |

### 2. `contest_project` 테이블
대회와 프로젝트를 연결하는 중간 테이블 (N:M 관계)

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| contest_id | bigint | 대회 ID (PK, FK) |
| project_id | bigint | 프로젝트 ID (PK, FK) |
| created_at | timestamp | 등록일시 |

## 🔐 RLS 정책

### contest 테이블 권한
- **SELECT**: 모두 허용 (공개)
- **INSERT**: web_admin_permission에 등록된 사용자만
- **UPDATE**: 대회 소유자 또는 web_admin
- **DELETE**: 대회 소유자 또는 web_admin

### contest_project 테이블 권한
- **SELECT**: 모두 허용 (공개)
- **INSERT**: 다음 중 하나에 해당하는 사용자
  - 대회 소유자
  - 프로젝트 소유자 (개인 프로필)
  - 프로젝트 소유 팀의 멤버
  - web_admin
- **DELETE**: INSERT와 동일한 권한

## 🚀 설치 방법

### 1단계: 테이블 생성
Supabase 대시보드 > SQL Editor에서 다음 파일을 실행:

```bash
001_create_contest_tables.sql
```

이 스크립트는:
- `contest` 테이블 생성
- `contest_project` 테이블 생성
- 필요한 인덱스 생성
- `updated_at` 자동 업데이트 트리거 설정

### 2단계: RLS 정책 적용
Supabase 대시보드 > SQL Editor에서 다음 파일을 실행:

```bash
002_create_contest_rls_policies.sql
```

이 스크립트는:
- `is_web_admin()` 헬퍼 함수 생성
- contest 테이블 RLS 정책 설정
- contest_project 테이블 RLS 정책 설정

### ⚠️ 주의사항
- 반드시 순서대로 실행해야 합니다 (001 → 002)
- `is_team_member()` 함수가 이미 존재해야 합니다 (기존 마이그레이션에서 생성됨)

## 📊 ER 다이어그램

```
┌─────────────────┐
│  auth.users     │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐       N     ┌──────────────────┐     N
│    contest      ├──────────────┤ contest_project  ├───────────┐
│                 │               └──────────────────┘           │
│ - contest_id    │                                              │
│ - contest_name  │                                              │
│ - owner (uuid)  │                                              │
│ - status        │                                              │
└─────────────────┘                                              │
                                                                 │
                                                         ┌───────▼──────┐
                                                         │   projects   │
                                                         │              │
                                                         │ - project_id │
                                                         │ - owner      │
                                                         └──────────────┘
```

## 🔄 롤백 방법

문제가 발생한 경우, 각 SQL 파일의 하단에 있는 롤백 스크립트를 실행하세요.

### RLS 정책 롤백 (002)
```sql
DROP POLICY IF EXISTS "Anyone can view contests" ON public.contest;
DROP POLICY IF EXISTS "Web admins can create contests" ON public.contest;
-- ... (나머지 정책들)
DROP FUNCTION IF EXISTS is_web_admin(uuid);
```

### 테이블 롤백 (001)
```sql
DROP TABLE IF EXISTS public.contest_project CASCADE;
DROP TABLE IF EXISTS public.contest CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

## 📝 다음 단계

데이터베이스 마이그레이션 완료 후:
1. TypeScript 타입 정의 생성 (`database.types.ts` 업데이트)
2. GraphQL 쿼리/뮤테이션 정의
3. Contest Config 작성 (`contestConfig.ts`)
4. Contest 페이지 및 컴포넌트 개발

## 🤝 기여

문제가 발견되거나 개선 사항이 있으면 이슈를 등록해주세요.
