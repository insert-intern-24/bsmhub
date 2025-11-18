-- ============================================================================
-- Contest 기능 테이블 생성
-- ============================================================================
--
-- 이 마이그레이션은 다음을 수행합니다:
-- 1. contest 테이블 생성 (대회 정보)
-- 2. contest_project 테이블 생성 (대회-프로젝트 연결)
-- 3. 인덱스 생성
--
-- 실행 방법:
-- Supabase 대시보드 > SQL Editor에서 이 스크립트를 실행하세요.
-- ============================================================================

-- ============================================================================
-- 1. contest 테이블 생성
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contest (
  contest_id bigserial PRIMARY KEY,
  contest_name text NOT NULL,
  description text,
  contest_image text,
  owner uuid NOT NULL,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  status smallint NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  -- Foreign Key to auth.users
  CONSTRAINT contest_owner_fkey FOREIGN KEY (owner)
    REFERENCES auth.users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) TABLESPACE pg_default;

-- contest 테이블 코멘트
COMMENT ON TABLE public.contest IS '대회 정보 테이블';
COMMENT ON COLUMN public.contest.contest_id IS '대회 고유 ID';
COMMENT ON COLUMN public.contest.contest_name IS '대회 이름';
COMMENT ON COLUMN public.contest.description IS '대회 설명';
COMMENT ON COLUMN public.contest.contest_image IS '대회 썸네일 이미지 URL';
COMMENT ON COLUMN public.contest.owner IS '대회 주최자 (auth.uid)';
COMMENT ON COLUMN public.contest.start_date IS '대회 시작일';
COMMENT ON COLUMN public.contest.end_date IS '대회 종료일';
COMMENT ON COLUMN public.contest.status IS '대회 상태 (0: 예정, 1: 진행중, 2: 종료)';
COMMENT ON COLUMN public.contest.created_at IS '생성일시';
COMMENT ON COLUMN public.contest.updated_at IS '수정일시';

-- ============================================================================
-- 2. contest_project 테이블 생성 (대회-프로젝트 연결)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contest_project (
  contest_id bigint NOT NULL,
  project_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),

  -- Primary Key (복합 키)
  CONSTRAINT contest_project_pkey PRIMARY KEY (contest_id, project_id),

  -- Foreign Keys
  CONSTRAINT contest_project_contest_id_fkey FOREIGN KEY (contest_id)
    REFERENCES public.contest (contest_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT contest_project_project_id_fkey FOREIGN KEY (project_id)
    REFERENCES public.projects (project_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) TABLESPACE pg_default;

-- contest_project 테이블 코멘트
COMMENT ON TABLE public.contest_project IS '대회-프로젝트 연결 테이블 (N:M 관계)';
COMMENT ON COLUMN public.contest_project.contest_id IS '대회 ID';
COMMENT ON COLUMN public.contest_project.project_id IS '프로젝트 ID';
COMMENT ON COLUMN public.contest_project.created_at IS '등록일시';

-- ============================================================================
-- 3. 인덱스 생성
-- ============================================================================

-- contest 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_contest_owner ON public.contest(owner);
CREATE INDEX IF NOT EXISTS idx_contest_status ON public.contest(status);
CREATE INDEX IF NOT EXISTS idx_contest_dates ON public.contest(start_date, end_date);

-- contest_project 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_contest_project_contest_id ON public.contest_project(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_project_project_id ON public.contest_project(project_id);

-- ============================================================================
-- 4. updated_at 자동 업데이트 트리거
-- ============================================================================

-- updated_at 자동 업데이트 함수 (없으면 생성)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- contest 테이블 트리거
DROP TRIGGER IF EXISTS update_contest_updated_at ON public.contest;
CREATE TRIGGER update_contest_updated_at
  BEFORE UPDATE ON public.contest
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 롤백 스크립트 (문제 발생 시 실행)
-- ============================================================================
-- DROP TRIGGER IF EXISTS update_contest_updated_at ON public.contest;
-- DROP TABLE IF EXISTS public.contest_project CASCADE;
-- DROP TABLE IF EXISTS public.contest CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
