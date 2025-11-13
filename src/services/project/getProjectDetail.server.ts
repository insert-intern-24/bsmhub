import { notFound } from 'next/navigation';
import { getProjectDetailRow } from '@/services/project/getProjectDetailRow.server';
import { toViewModel } from '@/services/project/projectMapper';
import type { ProjectDetailViewModel } from '@/services/project/types';

export const getProjectDetailViewModel = async (
  projectName: string,
  profileName?: string,
  teamName?: string
): Promise<ProjectDetailViewModel | null> => {
  // profileName과 teamName 중 하나는 무조건 존재함 (만약 존재하지 않을 경우 notFound).
  const ownerName = (profileName || teamName) ?? notFound();

  const project = await getProjectDetailRow(projectName, ownerName);
  if (!project) return null;

  return toViewModel(project);
};

