import { createClient } from '@/services/supabase/client';
import {
  PortfolioData,
  ProfileWithProjects,
} from '@/app/components/portfolio/types';
import { PaginatedPortfolioResponse } from '@/types/pagination';
import { unstable_cache } from 'next/cache';

// 캐시된 데이터 페칭 함수
async function fetchPaginatedPortfolioData(
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
    // 프로젝트 중복 제거를 위한 Map (project_id를 키로 사용)
    const projectMap = new Map();

    // 1. 기여한 프로젝트 추가
    data.project_contributors?.forEach((contribution) => {
      if (contribution.project?.project_id) {
        projectMap.set(contribution.project.project_id, {
          title: contribution.project.project_name,
          logo: contribution.project.project_logo,
          description: contribution.project.description,
          projectImage: contribution.project.project_thumbnail,
        });
      }
    });

    // 2. 소유한 프로젝트 추가 (중복 시 덮어씀 - 소유 프로젝트 우선)
    data.projects?.forEach((project) => {
      if (project.project_id) {
        projectMap.set(project.project_id, {
          title: project.project_name,
          logo: project.project_logo,
          description: project.description,
          projectImage: project.project_thumbnail,
        });
      }
    });

    return {
      profile: {
        name: data.profile_name,
        role: data.student?.student_jobs?.map(({ job }) => job.job_name) || [],
        bio: data.description!,
        status: '구직 중',
        profile_image: data.profile_image,
      },
      student: data.student,
      projects: Array.from(projectMap.values()),
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

// 캐시 래퍼 함수 (1시간 캐시, 페이지와 limit별로 별도 캐시)
export async function getPaginatedPortfolioData(
  page: number = 1,
  limit: number = 5,
): Promise<PaginatedPortfolioResponse> {
  return unstable_cache(
    async () => fetchPaginatedPortfolioData(page, limit),
    [`portfolio-paginated-${page}-${limit}`],
    {
      revalidate: 3600, // 1시간마다 재검증
      tags: ['portfolio'], // 태그 기반 캐시 무효화 가능
    },
  )();
}
