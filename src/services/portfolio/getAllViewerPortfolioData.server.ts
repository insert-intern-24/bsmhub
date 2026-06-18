'use server';

import { createClient } from '@/services/supabase/server';
import { calculateGradeFromJoinAt } from '@/utils/student/studentCalculations';

// Supabase 쿼리 결과 타입 (간소화)
type ProfileWithRelations = {
  profile_name: string | null;
  description: string | null;
  profile_image: string;
  email: string | null;
  student: {
    name: string;
    student_number: number | null;
    join_at: string;
    department: { department_name: string } | null;
    student_jobs: Array<{ job: { job_name: string } | null }>;
  } | null;
  profile_skills: Array<{ skills: { skill_name: string } | null }>;
  profile_competitions: Array<{
    prize: string;
    competitions: { competition_name: string } | null;
  }>;
  projects: Array<{
    project_name: string;
    description: string;
    profile?: { profile_name: string | null; is_team: boolean | null } | null;
  }> | null;
  project_contributors: Array<{
    description: string | null;
    project: {
      project_name: string;
      description: string;
      profile?: { profile_name: string | null; is_team: boolean | null } | null;
    } | null;
  }>;
};

export interface ViewerPortfolioData {
  profile: {
    profile_name: string | null;
    description: string | null;
    profile_image: string | null;
    email: string | null;
    status: string;
    role: string[];
  };
  student: {
    name: string | null;
    student_number: number | null;
    join_at: string | null;
  } | null;
  department: {
    department_name: string | null;
  } | null;
  jobs: Array<{
    job_name: string | null;
  }>;
  skills: Array<{
    skill_name: string | null;
  }>;
  competitions: Array<{
    competition_name: string | null;
    prize: string | null;
  }>;
  projects: Array<{
    project_name: string | null;
    description: string | null;
    owner_profile_name: string | null;
    owner_is_team: boolean | null;
  }>;
}

export async function getAllViewerPortfolioData(): Promise<ViewerPortfolioData[]> {
  const supabase = await createClient();

  // 프로필 데이터 조회 (전체 데이터)
  const query = supabase
    .from('profile')
    .select(
      `
      profile_name,
      description,
      profile_image,
      email,
      student!profile_owner_fkey1(
        name,
        student_number,
        join_at,
        department:departments(
          department_name
        ),
        student_jobs(
          job:jobs(
            job_name
          )
        )
      ),
      profile_skills(
        skills!fk_profile_skills_skill_id(
          skill_name
        )
      ),
      profile_competitions(
        prize,
        competitions(
          competition_name
        )
      ),
      projects!projects_owner_fkey(
        project_name,
        description,
        profile!projects_owner_fkey(
          profile_name,
          is_team
        )
      ),
      project_contributors(
        description,
        project:projects(
          project_name,
          description,
          profile!projects_owner_fkey(
            profile_name,
            is_team
          )
        )
      )
      `,
    )
    .eq('is_team', false);

  const { data: profiles, error: profileError } = await query;

  if (profileError) {
    console.error(
      'Failed to fetch viewer portfolio data from database:',
      profileError,
    );
    return [];
  }

  if (!profiles || profiles.length === 0) {
    return [];
  }

  // 데이터 변환 및 3학년 필터링
  const portfolioData: ViewerPortfolioData[] = (
    profiles as ProfileWithRelations[]
  )
    .filter((profile) => {
      // 입학년도(join_at)로 3학년 계산하여 필터링
      const joinAt = profile.student?.join_at;
      const grade = calculateGradeFromJoinAt(joinAt || null);
      return grade === 3;
    })
    .map((profile) => {
      // 프로젝트 중복 제거 및 병합
      const projectMap = new Map<string, {
        project_name: string | null;
        description: string | null;
        owner_profile_name: string | null;
        owner_is_team: boolean | null;
      }>();

      profile.projects?.forEach((project) => {
        if (project.project_name) {
          projectMap.set(project.project_name, {
            project_name: project.project_name,
            description: project.description,
            owner_profile_name: project.profile?.profile_name ?? null,
            owner_is_team: project.profile?.is_team ?? null,
          });
        }
      });

      profile.project_contributors?.forEach((contributor) => {
        const project = contributor.project;
        if (project?.project_name && !projectMap.has(project.project_name)) {
          projectMap.set(project.project_name, {
            project_name: project.project_name,
            description: project.description || contributor.description,
            owner_profile_name: project.profile?.profile_name ?? null,
            owner_is_team: project.profile?.is_team ?? null,
          });
        }
      });

      const jobNames = (profile.student?.student_jobs || [])
        .map((sj) => sj.job?.job_name)
        .filter((name): name is string => name !== null && name !== undefined);

      return {
        profile: {
          profile_name: profile.profile_name,
          description: profile.description,
          profile_image: profile.profile_image,
          email: profile.email,
          status: '구직 중', // 기본값 (getPersonalPortfolioData와 동일)
          role: jobNames,
        },
        student: profile.student
          ? {
              name: profile.student.name,
              student_number: profile.student.student_number,
              join_at: profile.student.join_at,
            }
          : null,
        department: profile.student?.department || null,
        jobs: (profile.student?.student_jobs || [])
          .map((sj) => sj.job?.job_name)
          .filter((name): name is string => name !== null && name !== undefined)
          .map((name) => ({ job_name: name })),
        skills: (profile.profile_skills || [])
          .map((ps) => ps.skills?.skill_name)
          .filter((name): name is string => name !== null && name !== undefined)
          .map((name) => ({ skill_name: name })),
        competitions: (profile.profile_competitions || [])
          .map((pc) => ({
            competition_name: pc.competitions?.competition_name ?? null,
            prize: pc.prize,
          }))
          .filter(
            (comp): comp is { competition_name: string; prize: string } =>
              comp.competition_name !== null && comp.prize !== null,
          ),
        projects: Array.from(projectMap.values()),
      };
    })
    .sort((a, b) => {
      const deptA = a.department?.department_name || '';
      const deptB = b.department?.department_name || '';
      const nameA = a.student?.name || '';
      const nameB = b.student?.name || '';

      // 소프트웨어개발과 우선 (공백 제거 후 비교)
      const isSoftwareA = deptA.replace(/\s+/g, '').includes('소프트웨어개발과');
      const isSoftwareB = deptB.replace(/\s+/g, '').includes('소프트웨어개발과');

      if (isSoftwareA !== isSoftwareB) return isSoftwareA ? -1 : 1;
      if (isSoftwareA) return nameA.localeCompare(nameB, 'ko');

      // 다른 과끼리는 과 이름순, 같으면 이름순
      const deptCompare = deptA.localeCompare(deptB, 'ko');
      return deptCompare !== 0 ? deptCompare : nameA.localeCompare(nameB, 'ko');
    });

  return portfolioData;
}

