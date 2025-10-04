import type { ProjectDetailRow, ProjectDetailViewModel } from '../../components/types';
import { normalizeYoutubeUrl, parseMarkdownPayload } from '../utils/content-utils';

const DEFAULT_ICON = '/card/dummy-project-icon.png';
const DEFAULT_GITHUB = 'https://github.com/example/bsmhub';
const DEFAULT_YOUTUBE = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

export const toViewModel = (project: ProjectDetailRow): ProjectDetailViewModel => {
  const { detailDescription, technologies, youtubeUrl, githubUrl, iconImage } = parseMarkdownPayload(
    project.project_markdown?.mark_desc ?? null,
  );

  const mergedDescription = detailDescription ?? project.description ?? '설명 정보가 없습니다.';
  const normalizedYoutubeUrl = youtubeUrl ? normalizeYoutubeUrl(youtubeUrl) : undefined;

  return {
    id: project.project_id,
    title: project.project_name,
    shortDescription: project.description,
    detailDescription: mergedDescription,
    githubUrl: githubUrl ?? DEFAULT_GITHUB,
    iconImage: iconImage ?? DEFAULT_ICON,
    youtubeUrl: normalizedYoutubeUrl ?? DEFAULT_YOUTUBE,
    technologies: technologies ?? [],
    team: (project.project_contributors ?? []).map((contributor, index) => ({
      id: contributor.student_id ?? `member-${index}`,
      name: contributor.student?.name ?? '이름 미정',
      role: contributor.description,
      profileImage: contributor.student?.profile ?? '/card/dummy-profile.png',
    })),
  };
};
