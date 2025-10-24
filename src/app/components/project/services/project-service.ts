import { notFound } from 'next/navigation';
import { fetchFromSupabase } from './dataSource/data-source';
import { toViewModel } from './mapper/project-mapper';

export const getProjectDetailViewModel = async (
  projectName: string,
  profileName?: string,
  teamName?: string
) => {
  // profileName과 teamName 중 하나는 무조건 존재함 (만약 존재하지 않을 경우 notFound).
  const ownerName = (profileName || teamName) ?? notFound();

  const project = await fetchFromSupabase(projectName, ownerName);
  if (!project) return null;

  return toViewModel(project);
};
