# Supabase RLS 정책 마이그레이션

## I25-266: 팀 프로젝트 수정 권한 부여

### 개요
팀 프로젝트에 대한 수정 권한을 팀원에게도 부여하고, 기여자가 본인의 기여자 정보만 수정할 수 있도록 RLS 정책을 강화합니다.

### 변경 사항

#### 1. 애플리케이션 코드
- **파일**: `src/services/project/checkProjectEditPermission.server.ts`
- **변경 내용**:
  - 프로젝트 소유자 확인 시 `is_team` 플래그 조회
  - 팀 프로젝트인 경우 `team_member` 테이블에서 팀원 확인
  - 팀원이면 수정 권한 부여
  - **기여자는 프로젝트 수정 불가** (본인의 기여 항목만 수정 가능)

#### 2. Supabase RLS 정책
- **파일**: `supabase/migrations/team_project_permissions.sql`
- **변경 내용**:
  - **헬퍼 함수**: `is_team_member()` 함수 생성 (성능 최적화)
  - **projects 테이블**: 
    - 팀원이 팀 프로젝트 수정 가능
  - **project_contributors 테이블**: 본인의 기여자 정보만 수정 가능
  - **project_html_description 테이블**: 팀원이 팀 프로젝트 설명 수정/추가/삭제 가능
  - **project_link 테이블**: 팀원이 팀 프로젝트 링크 수정/추가/삭제 가능
  - **project_skills 테이블**: 팀원이 팀 프로젝트 스킬 수정/추가/삭제 가능

### RLS 정책 적용 방법

#### 방법 1: Supabase 대시보드 사용
1. Supabase 대시보드에 로그인
2. 프로젝트 선택
3. 좌측 메뉴에서 "Database" → "Policies" 선택
4. `team_project_permissions.sql` 파일의 내용을 각 테이블에 적용

#### 방법 2: SQL 편집기 사용
1. Supabase 대시보드에 로그인
2. 좌측 메뉴에서 "SQL Editor" 선택
3. "New query" 클릭
4. `team_project_permissions.sql` 파일의 전체 내용을 복사하여 붙여넣기
5. "Run" 버튼 클릭하여 실행

#### 방법 3: Supabase CLI 사용 (권장)
```bash
# Supabase CLI가 설치되어 있다면
supabase db push

# 또는 특정 마이그레이션 파일만 실행
supabase db execute -f supabase/migrations/team_project_permissions.sql
```

### 테스트 방법

#### 1. 팀원 권한 테스트
```sql
-- 주의: 아래 UUID는 예시입니다. 실제 테스트 시 실제 UUID로 교체하세요.

-- 1. 팀 프로필 생성
INSERT INTO profile (profile_id, profile_name, is_team, owner)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Test Team', true, '550e8400-e29b-41d4-a716-446655440001');

-- 2. 팀원 추가
INSERT INTO team_member (profile_id, participant_id)
VALUES ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002');

-- 3. 팀 프로젝트 생성
INSERT INTO projects (owner, project_name, category_id, description, status)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Test Project', 1, 'Test Description', 1);

-- 4. 팀원 계정으로 로그인하여 프로젝트 수정 시도
-- 성공해야 함
```

#### 2. 기여자 본인 데이터만 수정 테스트
```sql
-- 주의: 아래 UUID는 예시입니다. 실제 테스트 시 실제 UUID로 교체하세요.

-- 1. 기여자 추가
INSERT INTO project_contributors (project_id, profile_id, description)
VALUES (1, '550e8400-e29b-41d4-a716-446655440003', 'My contribution');

-- 2. 기여자 계정으로 로그인하여 본인의 기여자 정보 수정 시도
-- 성공해야 함

-- 3. 기여자 계정으로 다른 기여자의 정보 수정 시도
-- 실패해야 함
```

### 롤백 방법
문제 발생 시 다음 SQL을 실행하여 롤백:

```sql
DROP POLICY IF EXISTS "Team members can update team projects" ON projects;
DROP POLICY IF EXISTS "Contributors can update projects they contribute to" ON projects;
DROP POLICY IF EXISTS "Contributors can update own contribution" ON project_contributors;
DROP POLICY IF EXISTS "Team members can update team project descriptions" ON project_html_description;
DROP POLICY IF EXISTS "Team members can insert team project descriptions" ON project_html_description;
DROP POLICY IF EXISTS "Team members can delete team project descriptions" ON project_html_description;
DROP POLICY IF EXISTS "Team members can update team project links" ON project_link;
DROP POLICY IF EXISTS "Team members can insert team project links" ON project_link;
DROP POLICY IF EXISTS "Team members can delete team project links" ON project_link;
DROP POLICY IF EXISTS "Team members can update team project skills" ON project_skills;
DROP POLICY IF EXISTS "Team members can insert team project skills" ON project_skills;
DROP POLICY IF EXISTS "Team members can delete team project skills" ON project_skills;
DROP FUNCTION IF EXISTS is_team_member(uuid, uuid);
```

### 주의사항
1. **백업**: RLS 정책 수정 전 반드시 현재 정책 백업
2. **순서**: 애플리케이션 코드 배포 전 RLS 정책 먼저 적용 권장
3. **성능**: 인덱스가 적절히 설정되어 있는지 확인
4. **모니터링**: 배포 후 권한 체크 오류 로그 모니터링

### 관련 파일
- `src/services/project/checkProjectEditPermission.server.ts`: 권한 체크 로직
- `supabase/migrations/team_project_permissions.sql`: RLS 정책
- `src/services/supabase/database.types.ts`: 데이터베이스 타입 정의
