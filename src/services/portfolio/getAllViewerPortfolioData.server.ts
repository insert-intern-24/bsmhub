'use server';

import { createClient } from '@/services/supabase/server';

export interface ViewerPortfolioData {
  profile: {
    profile_name: string | null;
    description: string | null;
    profile_image: string | null;
    email: string | null;
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
  }>;
}

export interface PaginatedViewerPortfolioResponse {
  data: ViewerPortfolioData[];
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export async function getAllViewerPortfolioData(
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedViewerPortfolioResponse> {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  // 전체 개수 조회
  const { count: totalCount, error: countError } = await supabase
    .from('profile')
    .select('*', { count: 'exact', head: true })
    .eq('is_team', false);

  if (countError) {
    console.error('Failed to fetch portfolio count:', countError);
    return {
      data: [],
      hasMore: false,
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
    };
  }

  // 페이지네이션된 프로필 데이터 조회
  const { data: profiles, error: profileError } = await supabase
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
        description
      ),
      project_contributors(
        description,
        project:projects(
          project_name,
          description
        )
      )
      `,
    )
    .eq('is_team', false)
    .range(offset, offset + limit - 1);

  if (profileError) {
    console.error(
      'Failed to fetch viewer portfolio data from database:',
      profileError,
    );
    return {
      data: [],
      hasMore: false,
      totalCount: totalCount || 0,
      currentPage: page,
      totalPages: 0,
    };
  }

  if (!profiles || profiles.length === 0) {
    const totalPages = Math.ceil((totalCount || 0) / limit);
    return {
      data: [],
      hasMore: false,
      totalCount: totalCount || 0,
      currentPage: page,
      totalPages,
    };
  }

  // 데이터 변환
  const portfolioData: ViewerPortfolioData[] = profiles.map((profile: any) => {
    // 프로젝트 중복 제거를 위한 Set
    const projectSet = new Set<string>();
    const projects: Array<{ project_name: string | null; description: string | null }> = [];

    // 소유한 프로젝트 추가
    if (profile.projects) {
      profile.projects.forEach((project: any) => {
        if (project.project_name && !projectSet.has(project.project_name)) {
          projectSet.add(project.project_name);
          projects.push({
            project_name: project.project_name,
            description: project.description,
          });
        }
      });
    }

    // 기여한 프로젝트 추가
    if (profile.project_contributors) {
      profile.project_contributors.forEach((contributor: any) => {
        if (
          contributor.project?.project_name &&
          !projectSet.has(contributor.project.project_name)
        ) {
          projectSet.add(contributor.project.project_name);
          projects.push({
            project_name: contributor.project.project_name,
            description: contributor.project.description || contributor.description,
          });
        }
      });
    }

    return {
      profile: {
        profile_name: profile.profile_name,
        description: profile.description,
        profile_image: profile.profile_image,
        email: profile.email,
      },
      student: profile.student
        ? {
            name: profile.student.name,
            student_number: profile.student.student_number,
            join_at: profile.student.join_at,
          }
        : null,
      department: profile.student?.department || null,
      jobs:
        profile.student?.student_jobs
          ?.map((sj: any) => ({ job_name: sj.job?.job_name }))
          .filter((job: any) => job.job_name !== null && job.job_name !== undefined) || [],
      skills:
        profile.profile_skills
          ?.map((ps: any) => ({ skill_name: ps.skills?.skill_name }))
          .filter((skill: any) => skill.skill_name !== null && skill.skill_name !== undefined) || [],
      competitions:
        profile.profile_competitions?.map((pc: any) => ({
          competition_name: pc.competitions?.competition_name,
          prize: pc.prize,
        })) || [],
      projects,
    };
  });

  const totalPages = Math.ceil((totalCount || 0) / limit);
  const hasMore = page < totalPages;

  return {
    data: portfolioData,
    hasMore,
    totalCount: totalCount || 0,
    currentPage: page,
    totalPages,
  };
}

