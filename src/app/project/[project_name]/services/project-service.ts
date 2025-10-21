import { fetchFromSupabase } from './dataSource/data-source';
import { toViewModel } from './mapper/project-mapper';

export const getProjectDetailViewModel = async (projectName: string) => {
  const project = await fetchFromSupabase(projectName);

  if (!project) {
    return null;
  }

  return toViewModel(project);
};
