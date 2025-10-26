import ProjectList from '@/app/components/ProjectList';
import { getProjects } from '@/services/server/project/getProjects';

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="flex-col gap-4 w-full">
      <div className="flex-center">
        <div className="h-[14.75rem] w-full bg-gray-base"></div>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
