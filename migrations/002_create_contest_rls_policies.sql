-- ============================================================================
-- Contest 테이블 RLS 정책 생성
-- ============================================================================
--
-- 이 마이그레이션은 다음을 수행합니다:
-- 1. 헬퍼 함수 생성 (is_web_admin)
-- 2. contest 테이블 RLS 정책 생성
-- 3. contest_project 테이블 RLS 정책 생성
--
-- 실행 방법:
-- Supabase 대시보드 > SQL Editor에서 이 스크립트를 실행하세요.
-- 반드시 001_create_contest_tables.sql을 먼저 실행한 후 실행해야 합니다.
-- ============================================================================

-- ============================================================================
-- 1. 헬퍼 함수: web_admin_permission 확인
-- ============================================================================

-- 주어진 사용자가 web_admin_permission에 등록되어 있는지 확인하는 함수
CREATE OR REPLACE FUNCTION is_web_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM web_admin_permission
    WHERE auth_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION is_web_admin(uuid) IS 'web_admin_permission 테이블에 등록된 사용자인지 확인';

-- ============================================================================
-- 2. contest 테이블 RLS 활성화 및 정책 생성
-- ============================================================================

-- RLS 활성화
ALTER TABLE public.contest ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 모두 허용 (대회는 공개)
DROP POLICY IF EXISTS "Anyone can view contests" ON public.contest;
CREATE POLICY "Anyone can view contests"
ON public.contest FOR SELECT
USING (true);

-- INSERT 정책: web_admin_permission에 등록된 사용자만 생성 가능
DROP POLICY IF EXISTS "Web admins can create contests" ON public.contest;
CREATE POLICY "Web admins can create contests"
ON public.contest FOR INSERT
WITH CHECK (
  is_web_admin(auth.uid())
);

-- UPDATE 정책: 소유자 또는 web_admin만 수정 가능
DROP POLICY IF EXISTS "Contest owners and admins can update contests" ON public.contest;
CREATE POLICY "Contest owners and admins can update contests"
ON public.contest FOR UPDATE
USING (
  owner = auth.uid() OR is_web_admin(auth.uid())
);

-- DELETE 정책: 소유자 또는 web_admin만 삭제 가능
DROP POLICY IF EXISTS "Contest owners and admins can delete contests" ON public.contest;
CREATE POLICY "Contest owners and admins can delete contests"
ON public.contest FOR DELETE
USING (
  owner = auth.uid() OR is_web_admin(auth.uid())
);

-- ============================================================================
-- 3. contest_project 테이블 RLS 활성화 및 정책 생성
-- ============================================================================

-- RLS 활성화
ALTER TABLE public.contest_project ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 모두 허용 (공개)
DROP POLICY IF EXISTS "Anyone can view contest projects" ON public.contest_project;
CREATE POLICY "Anyone can view contest projects"
ON public.contest_project FOR SELECT
USING (true);

-- INSERT 정책: 대회 소유자, 프로젝트 소유자, 또는 web_admin만 추가 가능
DROP POLICY IF EXISTS "Authorized users can add projects to contests" ON public.contest_project;
CREATE POLICY "Authorized users can add projects to contests"
ON public.contest_project FOR INSERT
WITH CHECK (
  -- 대회 소유자인 경우
  EXISTS (
    SELECT 1 FROM contest c
    WHERE c.contest_id = contest_project.contest_id
    AND c.owner = auth.uid()
  )
  OR
  -- 프로젝트 소유자인 경우 (개인 프로필)
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile pr ON pr.profile_id = p.owner
    WHERE p.project_id = contest_project.project_id
    AND pr.owner = auth.uid()
    AND pr.is_team = false
  )
  OR
  -- 프로젝트가 팀 소유이고, 사용자가 팀 멤버인 경우
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = contest_project.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
  OR
  -- web_admin인 경우
  is_web_admin(auth.uid())
);

-- DELETE 정책: 대회 소유자, 프로젝트 소유자, 또는 web_admin만 삭제 가능
DROP POLICY IF EXISTS "Authorized users can remove projects from contests" ON public.contest_project;
CREATE POLICY "Authorized users can remove projects from contests"
ON public.contest_project FOR DELETE
USING (
  -- 대회 소유자인 경우
  EXISTS (
    SELECT 1 FROM contest c
    WHERE c.contest_id = contest_project.contest_id
    AND c.owner = auth.uid()
  )
  OR
  -- 프로젝트 소유자인 경우 (개인 프로필)
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile pr ON pr.profile_id = p.owner
    WHERE p.project_id = contest_project.project_id
    AND pr.owner = auth.uid()
    AND pr.is_team = false
  )
  OR
  -- 프로젝트가 팀 소유이고, 사용자가 팀 멤버인 경우
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = contest_project.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
  OR
  -- web_admin인 경우
  is_web_admin(auth.uid())
);

-- ============================================================================
-- 4. 인덱스 최적화 (RLS 성능 향상)
-- ============================================================================

-- web_admin_permission 테이블 인덱스 (없으면 생성)
CREATE INDEX IF NOT EXISTS idx_web_admin_permission_auth_id
ON public.web_admin_permission(auth_id);

-- ============================================================================
-- 롤백 스크립트 (문제 발생 시 실행)
-- ============================================================================
-- DROP POLICY IF EXISTS "Anyone can view contests" ON public.contest;
-- DROP POLICY IF EXISTS "Web admins can create contests" ON public.contest;
-- DROP POLICY IF EXISTS "Contest owners and admins can update contests" ON public.contest;
-- DROP POLICY IF EXISTS "Contest owners and admins can delete contests" ON public.contest;
--
-- DROP POLICY IF EXISTS "Anyone can view contest projects" ON public.contest_project;
-- DROP POLICY IF EXISTS "Authorized users can add projects to contests" ON public.contest_project;
-- DROP POLICY IF EXISTS "Authorized users can remove projects from contests" ON public.contest_project;
--
-- DROP FUNCTION IF EXISTS is_web_admin(uuid);
