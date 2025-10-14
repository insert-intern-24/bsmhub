import { createClient } from '@/utils/supabase/client';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';
import { PortfolioData, ProfileWithProjects } from '@/app/portfolio/types';

export async function getPersonalPortfolioData(): Promise<PortfolioData[]> {
  const supabase = await createClient();

  // 프로필 데이터 조회
  const { data: profilesWithProjects, error: profileError } = await supabase
    .from('profile')
    .select(
      `
      profile_name,
      description,
      profile_image,
      project_contributors (
        project:projects (
          project_name,
          project_thumbnail,
          project_logo,
          description
        )
      ),
      profile_permission (
        student(
          name,
          student_jobs(
            job:jobs(
              job_name
            )
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
        role:
          data.profile_permission[0].student?.student_jobs.map(
            ({ job }) => job.job_name,
          ) || [],
        bio: data.description!,
        status: '구직 중',
        profile_image: convertFromDatabaseImageURL(data.profile_image),
      },
      student: data.profile_permission[0].student,
      projects:
        data.project_contributors?.map((contribution) => ({
          title: contribution.project.project_name,
          logo: convertFromDatabaseImageURL(contribution.project.project_logo),
          description: contribution.project.description,
          projectImage: convertFromDatabaseImageURL(
            contribution.project.project_thumbnail,
          ),
        })) || [],
    };
  });

  return portfolioData;
}
