import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';
import type { ProjectWithContributors } from './types';

export type Author = {
  name?: string;
  profileImage: string;
};

/**
 * 프로젝트의 기여자와 오너 정보를 기반으로 authors 배열을 생성합니다.
 * 기여자가 있으면 기여자만 포함하고, 없으면 오너만 포함합니다.
 * 오너는 기여자 목록에서 제외됩니다.
 */
export function createAuthorsFromProject(
  project: ProjectWithContributors,
): Author[] {
  const contributors =
    project.project_contributors?.filter(
      (c) => c.profile.profile_id !== project.profile.profile_id,
    ) || [];

  return contributors.length > 0
    ? contributors.map((c) => ({
        name: c.profile.profile_name,
        profileImage: convertFromDatabaseImageURL(c.profile.profile_image),
      }))
    : [
        {
          name: project.profile.profile_name,
          profileImage: convertFromDatabaseImageURL(
            project.profile.profile_image,
          ),
        },
      ];
}

