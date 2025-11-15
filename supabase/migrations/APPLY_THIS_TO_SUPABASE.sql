-- ============================================================================
-- ⚠️  중요: 이 파일을 Supabase SQL Editor에서 실행하세요!
-- ============================================================================
--
-- 적용 방법:
-- 1. https://supabase.com/dashboard 에서 프로젝트 선택
-- 2. 좌측 메뉴에서 "SQL Editor" 선택
-- 3. "New query" 클릭
-- 4. 이 파일의 전체 내용을 복사하여 붙여넣기
-- 5. "Run" 버튼 클릭
--
-- ============================================================================

-- ============================================================================
-- 0. 헬퍼 함수: 팀 멤버 확인 (성능 최적화)
-- ============================================================================

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

DROP POLICY IF EXISTS "Team members can update team projects" ON projects;

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

DROP POLICY IF EXISTS "Contributors can update own contribution" ON project_contributors;
DROP POLICY IF EXISTS "Team members can insert team project contributors" ON project_contributors;
DROP POLICY IF EXISTS "Team members can update team project contributors" ON project_contributors;
DROP POLICY IF EXISTS "Team members can delete team project contributors" ON project_contributors;

-- 본인의 기여자 정보만 수정 가능
CREATE POLICY "Contributors can update own contribution"
ON project_contributors FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profile
    WHERE profile.profile_id = project_contributors.profile_id
    AND profile.owner = auth.uid()
  )
);

-- 팀원은 팀 프로젝트의 기여자 추가 가능
CREATE POLICY "Team members can insert team project contributors"
ON project_contributors FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_contributors.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- 팀원은 팀 프로젝트의 기여자 정보 수정 가능
CREATE POLICY "Team members can update team project contributors"
ON project_contributors FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_contributors.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- 팀원은 팀 프로젝트의 기여자 삭제 가능
CREATE POLICY "Team members can delete team project contributors"
ON project_contributors FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN profile team_profile ON team_profile.profile_id = p.owner
    WHERE p.project_id = project_contributors.project_id
    AND team_profile.is_team = true
    AND is_team_member(team_profile.profile_id, auth.uid())
  )
);

-- ============================================================================
-- 3. project_html_description 테이블 RLS 정책
-- ============================================================================

DROP POLICY IF EXISTS "Team members can update team project descriptions" ON project_html_description;
DROP POLICY IF EXISTS "Team members can insert team project descriptions" ON project_html_description;
DROP POLICY IF EXISTS "Team members can delete team project descriptions" ON project_html_description;

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
-- 4. project_link 테이블 RLS 정책
-- ============================================================================

DROP POLICY IF EXISTS "Team members can update team project links" ON project_link;
DROP POLICY IF EXISTS "Team members can insert team project links" ON project_link;
DROP POLICY IF EXISTS "Team members can delete team project links" ON project_link;

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

-- ============================================================================
-- 5. project_skills 테이블 RLS 정책
-- ============================================================================

DROP POLICY IF EXISTS "Team members can update team project skills" ON project_skills;
DROP POLICY IF EXISTS "Team members can insert team project skills" ON project_skills;
DROP POLICY IF EXISTS "Team members can delete team project skills" ON project_skills;

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

-- ============================================================================
-- 6. 인덱스 최적화 (선택사항)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_team_member_profile_id ON team_member(profile_id);
CREATE INDEX IF NOT EXISTS idx_team_member_participant_id ON team_member(participant_id);
CREATE INDEX IF NOT EXISTS idx_profile_owner ON profile(owner);
CREATE INDEX IF NOT EXISTS idx_profile_is_team ON profile(is_team) WHERE is_team = true;

-- ============================================================================
-- 완료!
-- ============================================================================
-- 이제 팀원이 팀 프로젝트를 수정할 수 있습니다.
-- 애플리케이션에서 테스트해보세요!
