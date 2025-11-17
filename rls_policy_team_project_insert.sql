-- ============================================================================
-- 팀 멤버가 팀 프로젝트를 생성할 수 있도록 INSERT 권한 추가
-- ============================================================================
--
-- 이 SQL은 Supabase 대시보드의 SQL Editor에서 실행해야 합니다.
--
-- 배경:
-- 기존에는 개인 프로젝트만 생성할 수 있었지만,
-- 이제 팀 멤버가 팀 명의로 프로젝트를 생성할 수 있어야 합니다.
--
-- 이 마이그레이션은 다음을 수행합니다:
-- 1. 팀 멤버가 팀 프로젝트를 INSERT할 수 있도록 RLS 정책 추가
-- ============================================================================

-- 팀 멤버가 팀 프로젝트를 INSERT 할 수 있도록 정책 추가
CREATE POLICY "Team members can insert team projects"
ON projects FOR INSERT
WITH CHECK (
  -- owner가 팀 프로필이고, 사용자가 그 팀의 멤버인 경우
  EXISTS (
    SELECT 1 FROM profile AS team_profile
    WHERE team_profile.profile_id = projects.owner
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
  OR
  -- owner가 사용자 본인의 개인 프로필인 경우 (기존 동작 유지)
  EXISTS (
    SELECT 1 FROM profile AS personal_profile
    WHERE personal_profile.profile_id = projects.owner
    AND personal_profile.owner = auth.uid()
    AND personal_profile.is_team = false
  )
);

-- ============================================================================
-- 참고:
-- - is_team_member 함수는 기존 마이그레이션에서 이미 생성되어 있어야 합니다
-- - 이 정책은 INSERT만 허용하며, UPDATE/DELETE는 기존 정책을 따릅니다
-- ============================================================================

-- ============================================================================
-- 롤백 스크립트 (문제 발생 시 실행)
-- ============================================================================
-- DROP POLICY IF EXISTS "Team members can insert team projects" ON projects;
