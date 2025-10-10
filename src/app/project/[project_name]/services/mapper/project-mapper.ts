import type {
  ProjectDetailRow,
  ProjectDetailViewModel,
} from '../../components/types';

export const toViewModel = (
  project: ProjectDetailRow,
): ProjectDetailViewModel => {
  let detailDescription = project.description ?? '설명 정보가 없습니다.';

  if (project.project_markdown?.mark_desc) {
    try {
      const markdownData = JSON.parse(project.project_markdown.mark_desc);
      if (markdownData.detailDescription) {
        detailDescription = markdownData.detailDescription;
      }
    } catch (error) {
      console.warn('Failed to parse project_markdown.mark_desc:', error);
    }
  }

  return {
    id: project.project_id,
    title: project.project_name,
    introduction: project.description ?? '소개 정보가 없습니다.',
    detailDescription,
    githubUrl: project.link,
    iconImage: project.project_logo,
    technologies: project.skills ?? [],
    team: (project.project_contributors ?? []).map((contributor, index) => ({
      id: contributor.profile_id ?? `member-${index}`,
      name: contributor.profile?.profile_name ?? '이름 미정',
      role: contributor.description ?? '기여 내용 미정',
      profileImage: contributor.profile?.profile_image ?? null,
    })),
  };
};
