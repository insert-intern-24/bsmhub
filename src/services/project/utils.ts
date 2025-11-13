import type { ProjectContributor, ProjectOwnerProfile } from './types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

export type ProjectWithContributors = {
  project_contributors: ProjectContributor[];
};

export function createAuthorsFromProject(
  project: ProjectWithContributors,
): Array<{ name?: string; profileImage: string }> {
  return (
    project.project_contributors?.map((contributor) => ({
      name: contributor.profile.profile_name,
      profileImage: convertFromDatabaseImageURL(
        contributor.profile.profile_image,
      ),
    })) || []
  );
}

