import type { ProjectContributor, ProjectOwnerProfile } from '@/services/project/types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';
import type { CardProps } from '@/app/components/card/project/ProjectCard';

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
  const contributors = project.project_contributors
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

export type ProjectWithProfile = {
  project_id: number;
  project_name: string;
  description: string;
  project_thumbnail: string;
  profile: ProjectOwnerProfile;
  project_contributors: ProjectContributor[];
  project_category?: {
    category_name: string;
  };
};

/**
 * 프로젝트 데이터를 CardProps 형식으로 변환하는 헬퍼 함수
 */
export function mapProjectToCardProps(project: ProjectWithProfile): CardProps {
  return {
    id: project.project_id,
    title: project.project_name,
    projectImage: convertFromDatabaseImageURL(project.project_thumbnail),
    category: project.project_category?.category_name,
    description: project.description,
    isTeam: project.profile.is_team,
    ownerName: project.profile.profile_name,
    authors: createAuthorsFromProject(project, {
      profile_name: project.profile.profile_name,
      profile_image: project.profile.profile_image,
    }),
  };
}

