import type { ProjectContributor } from '@/services/project/types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

export type ProjectWithContributors = {
  project_contributors: ProjectContributor[];
};

type OwnerInfo = {
  profile_name: string;
  profile_image: string | null;
};

export function createAuthorsFromProject(
  project: ProjectWithContributors,
  owner?: OwnerInfo,
): Array<{ name?: string; profileImage: string }> {
  const contributors =
    project.project_contributors
      ?.filter((contributor) => contributor.profile !== null)
      .map((contributor) => ({
        name: contributor.profile!.profile_name,
        profileImage: convertFromDatabaseImageURL(
          contributor.profile!.profile_image,
        ),
      })) || [];

  // 기여자가 없고 owner 정보가 있으면 owner를 반환
  if (contributors.length === 0 && owner) {
    return [
      {
        name: owner.profile_name,
        profileImage: owner.profile_image
          ? convertFromDatabaseImageURL(owner.profile_image)
          : '',
      },
    ];
  }

  return contributors;
}
