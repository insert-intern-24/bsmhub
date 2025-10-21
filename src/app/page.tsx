import ProjectList from '@/app/components/ProjectList';
import { getProjects } from '@/services/projectService';

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="flex-col gap-[0.90625rem] w-full">
      <div className="flex-center">
        <div className="h-[14.75rem] w-full bg-gray-base"></div>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
