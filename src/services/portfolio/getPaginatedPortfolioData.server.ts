import { createClient } from '@/services/supabase/client';
import {
  PortfolioData,
  ProfileWithProjects,
} from '@/app/(box-layout)/portfolio/types';
import { PaginatedPortfolioResponse } from '@/types/pagination';

export async function getPaginatedPortfolioData(
  page: number = 1,
  limit: number = 5,
): Promise<PaginatedPortfolioResponse> {
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
  const { data: profilesWithProjects, error: profileError } = await supabase
    .from('profile')
    .select(
      `
      *,
      projects!projects_owner_fkey(
        project_id,
        project_name,
        project_thumbnail,
        project_logo,
        description,
        status
      ),
      project_contributors (
        description,
        project:projects (
          project_id,
          project_name,
          project_thumbnail,
          project_logo,
          description,
          status
        )
      ),
      student!profile_owner_fkey1(
        name,
        join_at,
        graduate_at,
        department:departments(
          *
        ),
        student_jobs(
          job:jobs(
            *
          )
        )
      )
      `,
    )
    .eq('is_team', false)
    .range(offset, offset + limit - 1)
    .returns<ProfileWithProjects[]>();

  if (profileError) {
    console.error(
      'Failed to fetch paginated portfolio profiles from database:',
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

  if (!profilesWithProjects || profilesWithProjects.length === 0) {
    return {
      data: [],
      hasMore: false,
      totalCount: totalCount || 0,
      currentPage: page,
      totalPages: Math.ceil((totalCount || 0) / limit),
    };
  }

  const portfolioData: PortfolioData[] = profilesWithProjects.map((data) => {
    return {
      profile: {
        name: data.profile_name,
        role: data.student?.student_jobs?.map(({ job }) => job.job_name) || [],
        bio: data.description!,
        status: '구직 중',
        profile_image: data.profile_image,
      },
      student: data.student,
      projects: [
        ...(data.project_contributors?.map((contribution) => ({
          title: contribution.project.project_name,
          logo: contribution.project.project_logo,
          description: contribution.project.description,
          projectImage: contribution.project.project_thumbnail,
        })) || []),
        ...data.projects?.map((project) => ({
          title: project.project_name,
          logo: project.project_logo,
          description: project.description,
          projectImage: project.project_thumbnail,
        })),
      ],
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
