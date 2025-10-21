import { CardProps } from '@/app/components/card/project/ProjectCard';
import { mockProjects } from '@/data/mockProjects';
import { getProjects as getProjectsFromServer } from '@/services/server/project/getProjects';

export async function getProjects(): Promise<CardProps[]> {
  const isMockMode = process.env.NEXT_MOCK_MODE === 'true';
  
  if (isMockMode) {
    return mockProjects;
  }

  try {
    return await getProjectsFromServer();
  } catch (error) {
    console.error('Database connection error:', error);
    return mockProjects;
  }
}