import type {
  ProjectDetailRow,
  ProjectDetailViewModel,
} from '@/services/project/types';

export const toViewModel = (
  project: ProjectDetailRow,
): ProjectDetailViewModel => {
  let detailDescription = '자세한 설명 정보가 없습니다.';

  if (project.project_html_description?.html_content) {
    detailDescription = project.project_html_description.html_content;
  } else if (project.description) {
    detailDescription = `<p>${project.description}</p>`;
  }

  // 중복된 profile_id 제거
  const seenProfileIds = new Set<string>();
  const uniqueContributors = (project.project_contributors ?? []).filter(
    (contributor) => {
      if (!contributor.profile_id) return false;
      if (seenProfileIds.has(contributor.profile_id)) return false;
      seenProfileIds.add(contributor.profile_id);
      return true;
    },
  );

  return {
    id: project.project_id,
    title: project.project_name,
    introduction: project.description ?? '소개 정보가 없습니다.',
    detailDescription,
    links: (project.project_link ?? []).map((link) => ({
      url: link.link,
      title: link.alt,
    })),
    iconImage: project.project_logo,
    technologies: (project.project_skills ?? [])
      .map((ps) => ps.skill_id)
      .filter((id): id is number => !!id),
    team: uniqueContributors.map((contributor, index) => ({
      id: contributor.profile_id ?? `member-${index}`,
      name: contributor.profile?.profile_name ?? '이름 미정',
      role: contributor.description ?? '기여 내용 미정',
      profileImage: contributor.profile?.profile_image ?? null,
    })),
  };
};
