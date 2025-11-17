import type { ProjectContributor, ProjectOwnerProfile } from '@/services/project/types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';
import { CardProps } from '@/app/components/card/project/ProjectCard';

export type ProjectWithContributors = {
  project_contributors: ProjectContributor[];
};

export type ProjectBase = {
  project_id: number;
  project_name: string;
  description: string;
  project_thumbnail: string;
  profile: ProjectOwnerProfile;
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

export function mapProjectToCardProps(
  project: ProjectBase,
  category?: string,
): CardProps {
  return {
    id: project.project_id,
    title: project.project_name,
    description: project.description,
    projectImage: convertFromDatabaseImageURL(project.project_thumbnail),
    ownerName: project.profile.profile_name,
    ownerProfileImage: project.profile.profile_image
      ? convertFromDatabaseImageURL(project.profile.profile_image)
      : undefined,
    isTeam: project.profile.is_team,
    category,
    authors: createAuthorsFromProject(project),
  };
}

