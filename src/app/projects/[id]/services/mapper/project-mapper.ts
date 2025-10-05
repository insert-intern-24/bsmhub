import type { ProjectDetailRow, ProjectDetailViewModel } from '../../components/types';
import { parseMarkdownPayload } from '../utils/content-utils';

const DEFAULT_ICON = process.env.NEXT_PUBLIC_PROJECT_DEFAULT_ICON ?? '/card/dummy-project-icon.png';
const DEFAULT_PROFILE = process.env.NEXT_PUBLIC_PROJECT_FALLBACK_PROFILE ?? '/card/dummy-profile.png';

export const toViewModel = (project: ProjectDetailRow): ProjectDetailViewModel => {
  const { detailDescription, technologies, githubUrl, iconImage } = parseMarkdownPayload(
    project.project_markdown?.mark_desc ?? null,
  );

  const mergedDescription = detailDescription ?? project.description ?? '설명 정보가 없습니다.';

  return {
    id: project.project_id,
    title: project.project_name,
    shortDescription: project.description ?? '설명 정보가 없습니다.',
    detailDescription: mergedDescription,
    githubUrl: githubUrl ?? null,
    iconImage: iconImage ?? DEFAULT_ICON,
    technologies: technologies ?? [],
    team: (project.project_contributors ?? []).map((contributor, index) => ({
      id: contributor.student_id ?? `member-${index}`,
      name: contributor.student?.name ?? '이름 미정',
      role: contributor.description ?? '기여 내용 미정',
      profileImage: contributor.student?.profile ?? DEFAULT_PROFILE,
    })),
  };
};
