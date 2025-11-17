import type { ProjectContributor, ProjectOwnerProfile } from '@/services/project/types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';
import { CardProps } from '@/app/components/card/project/ProjectCard';

export type ProjectBase = {
  project_id: number;
  project_name: string;
  description: string;
  project_thumbnail: string;
  profile: ProjectOwnerProfile;
  project_contributors: ProjectContributor[];
};

const createAuthors = (contributors: ProjectContributor[]) =>
  contributors
    ?.filter((c) => c.profile)
    .map((c) => ({
      name: c.profile!.profile_name,
      profileImage: convertFromDatabaseImageURL(c.profile!.profile_image),
    })) || [];

export const mapProjectToCardProps = (project: ProjectBase, category?: string): CardProps => ({
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
  authors: createAuthors(project.project_contributors),
});

