'use server';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import { createClient } from '@/services/supabase/server';
import { Tables } from '@/services/supabase/database.types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';
import type {
  ProjectContributor,
  ProjectOwnerProfile,
} from '@/services/project/types';
import { createAuthorsFromProject } from '@/services/project/utils';

export type PersonalProjectType = Pick<
  Tables<'projects'>,
  'project_id' | 'project_name' | 'description' | 'project_thumbnail'
>;

type PersonalProjectTypeWithProfile = PersonalProjectType & {
  profile: ProjectOwnerProfile;
  project_contributors: ProjectContributor[];
};

export const getPersonalProjects = async (
  profile_id: string,
): Promise<CardProps[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(
      `
      project_id,
      project_name,
      description,
      project_thumbnail,
      profile!projects_owner_fkey (
        profile_id,
        profile_name,
        profile_image,
        is_team,
        student!profile_owner_fkey1 (
          name
        )
      ),
      project_contributors (
        profile (
          profile_id,
          profile_name,
          profile_image,
          student!profile_owner_fkey1 (
            name
          )
        )
      )
    `,
    )
    .eq('owner', profile_id);

  if (error) {
    console.error('개인 프로젝트 조회 중 오류');
  }

  const projects: CardProps[] = (data as PersonalProjectTypeWithProfile[]).map(
    (project) => ({
      id: project.project_id,
      title: project.project_name,
      description: project.description,
      projectImage: convertFromDatabaseImageURL(project.project_thumbnail),
      ownerName: project.profile.profile_name,
      isTeam: project.profile.is_team,
      authors: createAuthorsFromProject(project, {
        profile_image: project.profile.profile_image,
        student: project.profile.student,
      }),
    }),
  );

  return projects || [];
};
