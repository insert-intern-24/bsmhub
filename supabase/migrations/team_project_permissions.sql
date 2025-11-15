-- ============================================================================
-- I25-266: 팀 프로젝트 수정 권한 부여
-- ============================================================================
-- 팀 프로젝트면 팀원에게도 수정권한 부여하기
--
-- 이 마이그레이션은 다음을 수행합니다:
-- 1. 팀원이 팀 프로젝트를 수정할 수 있도록 RLS 정책 추가
-- 2. 기여자가 본인의 기여자 정보만 수정할 수 있도록 RLS 정책 강화
-- ============================================================================

-- ============================================================================
-- 1. projects 테이블 RLS 정책
-- ============================================================================

-- 팀원도 팀 프로젝트 수정 가능
-- 기존 "Users can update own projects" 정책은 유지하고, 새로운 정책 추가
CREATE POLICY "Team members can update team projects"
ON projects FOR UPDATE
USING (
  EXISTS (
    -- 1. 프로젝트의 소유자(owner)가 팀 프로필인지 확인
    SELECT 1 FROM profile AS team_profile
    WHERE team_profile.profile_id = projects.owner
    AND team_profile.is_team = true
    -- 2. 현재 사용자가 해당 팀의 팀원인지 확인
    AND EXISTS (
      SELECT 1 FROM team_member
      WHERE team_member.profile_id = team_profile.profile_id
      -- 3. 팀원의 participant_id가 가리키는 프로필의 owner가 현재 사용자인지 확인
      AND EXISTS (
        SELECT 1 FROM profile AS member_profile
        WHERE member_profile.profile_id = team_member.participant_id
        AND member_profile.owner = auth.uid()
      )
    )
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
    SELECT 1 FROM projects
    WHERE projects.project_id = project_html_description.project_id
    AND EXISTS (
      SELECT 1 FROM profile AS team_profile
      WHERE team_profile.profile_id = projects.owner
      AND team_profile.is_team = true
      AND EXISTS (
        SELECT 1 FROM team_member
        WHERE team_member.profile_id = team_profile.profile_id
        AND EXISTS (
          SELECT 1 FROM profile AS member_profile
          WHERE member_profile.profile_id = team_member.participant_id
          AND member_profile.owner = auth.uid()
        )
      )
    )
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
    SELECT 1 FROM projects
    WHERE projects.project_id = project_link.project_id
    AND EXISTS (
      SELECT 1 FROM profile AS team_profile
      WHERE team_profile.profile_id = projects.owner
      AND team_profile.is_team = true
      AND EXISTS (
        SELECT 1 FROM team_member
        WHERE team_member.profile_id = team_profile.profile_id
        AND EXISTS (
          SELECT 1 FROM profile AS member_profile
          WHERE member_profile.profile_id = team_member.participant_id
          AND member_profile.owner = auth.uid()
        )
      )
    )
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
    SELECT 1 FROM projects
    WHERE projects.project_id = project_skills.project_id
    AND EXISTS (
      SELECT 1 FROM profile AS team_profile
      WHERE team_profile.profile_id = projects.owner
      AND team_profile.is_team = true
      AND EXISTS (
        SELECT 1 FROM team_member
        WHERE team_member.profile_id = team_profile.profile_id
        AND EXISTS (
          SELECT 1 FROM profile AS member_profile
          WHERE member_profile.profile_id = team_member.participant_id
          AND member_profile.owner = auth.uid()
        )
      )
    )
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
-- DROP POLICY IF EXISTS "Team members can update team project links" ON project_link;
-- DROP POLICY IF EXISTS "Team members can update team project skills" ON project_skills;
