import type { ProjectContributor } from '@/services/project/types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

export type ProjectWithContributors = {
  project_contributors: ProjectContributor[];
};

export function createAuthorsFromProject(
  project: ProjectWithContributors,
): Array<{ name?: string; profileImage: string }> {
  return (
    project.project_contributors
      ?.filter((contributor) => contributor.profile !== null)
      .map((contributor) => ({
        name: contributor.profile!.profile_name,
        profileImage: convertFromDatabaseImageURL(
          contributor.profile!.profile_image,
        ),
      })) || []
  );
}

