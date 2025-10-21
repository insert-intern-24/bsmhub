import ProjectCard from '@/app/components/card/project/ProjectCard';
import { getProjects } from '@/services/projectService';

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.title}
          projectImage={project.projectImage}
          authors={project.authors}
        />
      ))}
    </div>
  );
}
