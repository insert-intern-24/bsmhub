import { createClient } from '@/utils/supabase/client';
import { convertTofromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';
import { PortfolioData, ProfileWithProjects } from '../types';

export async function getPortfolioData(): Promise<PortfolioData[]> {
  const supabase = await createClient();

  // 프로필 데이터 조회
  const { data: profilesWithProjects, error: profileError } = await supabase
    .from('profile')
    .select(
      `
      *,
      project_contributors (
        description,
        projects (
          project_id,
          project_name,
          project_thumbnail,
          project_logo,
          status
        )
      ),
      profile_permission (
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
      )
      `,
    )
    .eq('isTeam', false)
    .returns<ProfileWithProjects[]>();

  if (profileError) {
    console.error('Error fetching profiles:', profileError);
    return [];
  }

  if (!profilesWithProjects || profilesWithProjects.length === 0) {
    return [];
  }

  console.log(profilesWithProjects[0]);

  const portfolioData: PortfolioData[] = profilesWithProjects.map((data) => {
    return {
      profile: {
        name: data.profile_name,
        role:
          data.profile_permission.student?.student_jobs
            .map(({ job }) => job.job_name)
            .join(', ') || 'No role specified',
        bio: data.email || 'No bio available',
        status: 'Active',
        profile_image: convertTofromDatabaseImageURL(data.profile_image),
      },
      projects:
        data.project_contributors?.map((contribution) => ({
          title: contribution.projects.project_name,
          logo: convertTofromDatabaseImageURL(
            contribution.projects.project_logo,
          ),
          projectImage: convertTofromDatabaseImageURL(
            contribution.projects.project_thumbnail,
          ),
        })) || [],
    };
  });

  return portfolioData;
}
