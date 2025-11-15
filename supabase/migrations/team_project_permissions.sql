-- ============================================================================
-- I25-266: 팀 프로젝트 수정 권한 부여
-- ============================================================================
-- 팀 프로젝트면 팀원에게도 수정권한 부여하기
--
-- 이 마이그레이션은 다음을 수행합니다:
-- 1. 팀원이 팀 프로젝트를 수정할 수 있도록 RLS 정책 추가
-- 2. 기여자가 본인의 기여자 정보만 수정할 수 있도록 RLS 정책 강화
-- 3. 성능 최적화를 위한 헬퍼 함수 생성
-- ============================================================================

-- ============================================================================
-- 0. 헬퍼 함수: 팀 멤버 확인 (성능 최적화)
-- ============================================================================

-- 주어진 팀 프로필의 멤버인지 확인하는 함수
CREATE OR REPLACE FUNCTION is_team_member(team_profile_id uuid, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_member tm
    JOIN profile p ON p.profile_id = tm.participant_id
    WHERE tm.profile_id = team_profile_id
    AND p.owner = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- 1. projects 테이블 RLS 정책
-- ============================================================================

-- 팀원도 팀 프로젝트 수정 가능
-- 기존 "Users can update own projects" 정책은 유지하고, 새로운 정책 추가
CREATE POLICY "Team members can update team projects"
ON projects FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profile AS team_profile
    WHERE team_profile.profile_id = projects.owner
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- ============================================================================
-- 2. project_contributors 테이블 RLS 정책
-- ============================================================================

-- 기존 정책이 너무 느슨한 경우를 대비하여, 본인의 기여자 정보만 수정 가능하도록 정책 추가
-- 기존 정책이 있다면 삭제하고 새로 생성
DROP POLICY IF EXISTS "Contributors can update own contribution" ON project_contributors;

CREATE POLICY "Contributors can update own contribution"
ON project_contributors FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profile
    WHERE profile.profile_id = project_contributors.profile_id
    AND profile.owner = auth.uid()
  )
);

-- ============================================================================
-- 3. project_html_description 테이블 RLS 정책
-- ============================================================================

-- 팀원도 팀 프로젝트의 상세 설명 수정 가능
CREATE POLICY "Team members can update team project descriptions"
ON project_html_description FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_html_description.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- 팀원도 팀 프로젝트의 상세 설명 추가(INSERT) 가능
CREATE POLICY "Team members can insert team project descriptions"
ON project_html_description FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_html_description.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- ============================================================================
-- 4. project_link 테이블 RLS 정책
-- ============================================================================

-- 팀원도 팀 프로젝트의 링크 수정 가능
CREATE POLICY "Team members can update team project links"
ON project_link FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_link.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- 팀원도 팀 프로젝트의 링크 추가(INSERT) 가능
CREATE POLICY "Team members can insert team project links"
ON project_link FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_link.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- ============================================================================
-- 5. project_skills 테이블 RLS 정책
-- ============================================================================

-- 팀원도 팀 프로젝트의 스킬 수정 가능
CREATE POLICY "Team members can update team project skills"
ON project_skills FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_skills.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- 팀원도 팀 프로젝트의 스킬 추가(INSERT) 가능
CREATE POLICY "Team members can insert team project skills"
ON project_skills FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_skills.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);
-- ============================================================================
-- 팀원도 팀 프로젝트의 링크/스킬/설명 삭제 가능
-- ============================================================================

-- 팀원도 팀 프로젝트의 링크 삭제 가능
CREATE POLICY "Team members can delete team project links"
ON project_link FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_link.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- 팀원도 팀 프로젝트의 스킬 삭제 가능
CREATE POLICY "Team members can delete team project skills"
ON project_skills FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_skills.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- 팀원도 팀 프로젝트의 설명 삭제 가능
CREATE POLICY "Team members can delete team project descriptions"
ON project_html_description FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_html_description.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- ============================================================================
-- 인덱스 최적화 (선택사항)
-- ============================================================================
-- RLS 정책 성능 향상을 위한 인덱스
-- 이미 존재하는 경우 무시됨

-- team_member 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_team_member_profile_id
ON team_member(profile_id);

CREATE INDEX IF NOT EXISTS idx_team_member_participant_id
ON team_member(participant_id);

-- profile 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_profile_owner
ON profile(owner);

CREATE INDEX IF NOT EXISTS idx_profile_is_team
ON profile(is_team) WHERE is_team = true;

-- ============================================================================
-- 롤백 스크립트 (참고용)
-- ============================================================================
-- 문제 발생 시 아래 명령어로 롤백 가능:
--
-- DROP POLICY IF EXISTS "Team members can update team projects" ON projects;
-- DROP POLICY IF EXISTS "Contributors can update own contribution" ON project_contributors;
-- DROP POLICY IF EXISTS "Team members can update team project descriptions" ON project_html_description;
-- DROP POLICY IF EXISTS "Team members can insert team project descriptions" ON project_html_description;
-- DROP POLICY IF EXISTS "Team members can delete team project descriptions" ON project_html_description;
-- DROP POLICY IF EXISTS "Team members can update team project links" ON project_link;
-- DROP POLICY IF EXISTS "Team members can insert team project links" ON project_link;
-- DROP POLICY IF EXISTS "Team members can delete team project links" ON project_link;
-- DROP POLICY IF EXISTS "Team members can update team project skills" ON project_skills;
-- DROP POLICY IF EXISTS "Team members can insert team project skills" ON project_skills;
-- DROP POLICY IF EXISTS "Team members can delete team project skills" ON project_skills;
-- DROP FUNCTION IF EXISTS is_team_member(uuid, uuid);
