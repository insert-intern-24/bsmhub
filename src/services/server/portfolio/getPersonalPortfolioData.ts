import { createClient } from '@/utils/supabase/client';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';
import { PortfolioData, ProfileWithProjects } from '@/app/(box-layout)/portfolio/types';

export async function getPersonalPortfolioData(): Promise<PortfolioData[]> {
  const supabase = await createClient();

  // 프로필 데이터 조회
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
      student(
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
    .returns<ProfileWithProjects[]>();

  if (profileError) {
    console.error(
      'Failed to fetch portfolio profiles from database:',
      profileError,
    );
    return [];
  }

  if (!profilesWithProjects || profilesWithProjects.length === 0) {
    return [];
  }

  const portfolioData: PortfolioData[] = profilesWithProjects.map((data) => {
    return {
      profile: {
        name: data.profile_name,
        role: data.student.student_jobs?.map(({ job }) => job.job_name) || [],
        bio: data.description!,
        status: '구직 중',
        profile_image: convertFromDatabaseImageURL(data.profile_image),
      },
      student: data.student,
      projects: [
        ...(data.project_contributors?.map((contribution) => ({
          title: contribution.project.project_name,
          logo: convertFromDatabaseImageURL(contribution.project.project_logo),
          description: contribution.project.description,
          projectImage: convertFromDatabaseImageURL(
            contribution.project.project_thumbnail,
          ),
        })) || []),
        ...data.projects?.map((project) => ({
          title: project.project_name,
          logo: convertFromDatabaseImageURL(project.project_logo),
          description: project.description,
          projectImage: convertFromDatabaseImageURL(project.project_thumbnail),
        })),
      ],
    };
  });

  return portfolioData;
}
