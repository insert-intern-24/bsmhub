import { CardProps } from '@/app/components/card/project/ProjectCard';
import { getProjects as getProjectsFromServer } from '@/services/server/project/getProjects';

export async function getProjects(): Promise<CardProps[]> {
  try {
    return await getProjectsFromServer();
  } catch (error) {
    console.error('Database connection error:', error);
    return [];
  }
}
