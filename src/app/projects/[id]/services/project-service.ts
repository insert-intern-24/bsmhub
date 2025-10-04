import { fetchProjectRow } from './dataSource/data-source';
import { toViewModel } from './mapper/project-mapper';

export const getProjectDetailViewModel = async (projectId: number) => {
  const project = await fetchProjectRow(projectId);

  if (!project) {
    return null;
  }

  return toViewModel(project);
};
