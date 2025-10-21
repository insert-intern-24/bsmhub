import ProjectList from '@/app/components/ProjectList';
import { getProjects } from '@/services/projectService';

export default async function Home() {
  const projects = await getProjects();

  return <ProjectList projects={projects} />;
}
