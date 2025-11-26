'use server';
import { createClient } from '@/services/supabase/server';
import { PersonalProjectType } from '@/services/project/getPersonalProjects.server';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import { Tables } from '@/services/supabase/database.types';

type TeamProjectType = {
  projects: PersonalProjectType & {
    profile: Pick<
      Tables<'profile'>,
      'profile_id' | 'is_team' | 'profile_name' | 'is_official' | 'profile_image'
    > & {
      student?: Pick<Tables<'student'>, 'name'> | null;
    };
  };
};

type ProfileImageType = {
  project_id: number;
  profile: Pick<
    Tables<'profile'>,
    'profile_id' | 'profile_name' | 'profile_image' | 'is_team'
  > & {
    student?: Pick<Tables<'student'>, 'name'> | null;
  };
};

export const getCooperationProjects = async (
  profile_id: string,
): Promise<CardProps[]> => {
  const supabase = await createClient();

  const getTeamProjects = async (
    profile_id: string,
  ): Promise<TeamProjectType[]> => {
    const { data, error } = await supabase
      .from('project_contributors')
      .select(
        `
        projects!inner (
          project_id,
          project_name,
          description,
          project_thumbnail,
          profile!projects_owner_fkey!inner (
            profile_id,
            profile_name,
            profile_image,
            is_team,
            is_official,
            student!profile_owner_fkey1 (
              name
            )
          )
        )
      `,
      )
      .eq('profile_id', profile_id)
      .eq('projects.profile.is_team', true);

    if (error) {
      console.error('팀 프로젝트 조회 중 오류:', error);
      return [];
    }

    return data || [];
  };

  const getProfileImages = async (
    projectIds: number[],
  ): Promise<ProfileImageType[]> => {
    const { data, error } = await supabase
      .from('project_contributors')
      .select(
        `
        project_id,
        profile!inner (
          profile_id,
          profile_name,
          profile_image,
          is_team,
          student!profile_owner_fkey1 (
            name
          )
        )
      `,
      )
      .in('project_id', projectIds);

    if (error) {
      console.error('프로필 이미지 조회 중 오류', error);
      return [];
    }

    return data || [];
  };

  const teamProjects = await getTeamProjects(profile_id);

  const projectIds = teamProjects.map((data) => data.projects.project_id);
  const profileImages = await getProfileImages(projectIds);

  const projects: CardProps[] = teamProjects.map(({ projects }) => {
    const authors: Array<{ name?: string; profileImage: string }> = [];

    // Owner를 먼저 추가 (team이 owner인 경우 제외)
    if (!projects.profile.is_team) {
      authors.push({
        name: projects.profile.student?.name,
        profileImage: projects.profile.profile_image,
      });
    }

    // Contributors 추가 (owner와 중복되지 않도록)
    const contributors = profileImages
      ?.filter((img) => img.project_id === projects.project_id)
      .map((img) => ({
        name: img.profile.is_team
          ? img.profile.profile_name
          : img.profile.student?.name,
        profileImage: img.profile.profile_image,
      })) || [];

    contributors.forEach((contributor) => {
      const isDuplicate = authors.some(
        (author) =>
          author.name === contributor.name &&
          author.profileImage === contributor.profileImage,
      );
      if (!isDuplicate) {
        authors.push(contributor);
      }
    });

    return {
      id: projects.project_id,
      title: projects.project_name,
      description: projects.description,
      projectImage: projects.project_thumbnail,
      ownerName: projects.profile.profile_name,
      isTeam: projects.profile.is_team,
      isOfficial: Boolean(projects.profile.is_official),
      authors: authors,
    };
  });

  return projects;
};
