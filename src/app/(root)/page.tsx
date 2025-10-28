import ProjectList from '@/app/components/ProjectList';
import { getProjects } from '@/services/server/project/getProjects';
import OneTapComponent from '@/app/components/auth/GoogleOneTab';

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="flex-col gap-4 w-full">
      <OneTapComponent />
      <div className="flex-center">
        <div className="h-[14.75rem] w-full justify-between flex mobile:justify-center">
          <div className="h-full w-[53.5rem] mobile:hidden bg-gray-50 rounded-[0.25rem]"></div>
          <div className="h-full w-[26rem] mobile:w-full mobile:h-[15rem] bg-gray-50 rounded-[0.25rem]"></div>
          <div className="h-full w-[26rem] mobile:hidden bg-gray-50 rounded-[0.25rem]"></div>
        </div>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
