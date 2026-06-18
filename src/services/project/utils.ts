import type { ProjectContributor } from '@/services/project/types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

export type ProjectWithContributors = {
  project_contributors: ProjectContributor[];
};

type OwnerInfo = {
  profile_name: string;
  profile_image: string | null;
  is_team: boolean;
  student?: { name: string } | null;
};

export function createAuthorsFromProject(
  project: ProjectWithContributors,
  owner?: OwnerInfo,
): Array<{ name?: string; profileImage: string }> {
  const authors: Array<{ name?: string; profileImage: string }> = [];

  // Owner를 먼저 추가 (team이 owner인 경우 제외)
  if (owner && !owner.is_team) {
    authors.push({
      name: owner.student?.name,
      profileImage: owner.profile_image
        ? convertFromDatabaseImageURL(owner.profile_image)
        : '',
    });
  }

  // Contributors 추가 (owner와 중복되지 않도록)
  const contributors =
    project.project_contributors
      ?.filter((contributor) => contributor.profile !== null)
      .map((contributor) => ({
        name: contributor.profile!.is_team
          ? contributor.profile!.profile_name
          : contributor.profile!.student?.name,
        profileImage: convertFromDatabaseImageURL(
          contributor.profile!.profile_image,
        ),
      })) || [];

  // Owner와 중복되지 않는 contributors만 추가
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

  return authors;
}
