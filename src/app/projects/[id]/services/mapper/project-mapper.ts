import type { ProjectDetailRow, ProjectDetailViewModel } from '../../components/types';
import { parseMarkdownPayload } from '../utils/content-utils';

const DEFAULT_ICON = '/card/dummy-project-icon.png';
const DEFAULT_GITHUB = 'https://github.com/example/bsmhub';

export const toViewModel = (project: ProjectDetailRow): ProjectDetailViewModel => {
  const { detailDescription, technologies, githubUrl, iconImage } = parseMarkdownPayload(
    project.project_markdown?.mark_desc ?? null,
  );

  const mergedDescription = detailDescription ?? project.description ?? '설명 정보가 없습니다.';

  return {
    id: project.project_id,
    title: project.project_name,
    shortDescription: project.description,
    detailDescription: mergedDescription,
    githubUrl: githubUrl ?? DEFAULT_GITHUB,
    iconImage: iconImage ?? DEFAULT_ICON,
    technologies: technologies ?? [],
    team: (project.project_contributors ?? []).map((contributor, index) => ({
      id: contributor.student_id ?? `member-${index}`,
      name: contributor.student?.name ?? '이름 미정',
      role: contributor.description,
      profileImage: contributor.student?.profile ?? '/card/dummy-profile.png',
    })),
  };
};
