import { fetchProjectRow } from './dataSource/data-source';
import { toViewModel } from './mapper/project-mapper';

export const getProjectDetailViewModel = async (projectName: string) => {
  const project = await fetchProjectRow(projectName);

  if (!project) {
    return null;
  }

  return toViewModel(project);
};
