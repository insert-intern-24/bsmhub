import type { ProjectDetailRow, ProjectDetailViewModel } from '../../components/types';

const DEFAULT_ICON = process.env.NEXT_PUBLIC_PROJECT_DEFAULT_ICON ?? '/card/dummy-project-icon.png';
const DEFAULT_PROFILE = process.env.NEXT_PUBLIC_PROJECT_FALLBACK_PROFILE ?? '/card/dummy-profile.png';

export const toViewModel = (project: ProjectDetailRow): ProjectDetailViewModel => {
  return {
    id: project.project_id,
    title: project.project_name,
    introduction: project.introduction ?? '소개 정보가 없습니다.',
    detailDescription: project.description ?? '설명 정보가 없습니다.',
    githubUrl: project.link,
    iconImage: DEFAULT_ICON,
    technologies: project.skills ?? [],
    team: (project.project_contributors ?? []).map((contributor, index) => ({
      id: contributor.profile_id ?? `member-${index}`,
      name: contributor.profile?.profile_name ?? '이름 미정',
      role: contributor.description ?? '기여 내용 미정',
      profileImage: contributor.profile?.profile_image ?? DEFAULT_PROFILE,
    })),
  };
};
