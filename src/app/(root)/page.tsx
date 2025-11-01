import ProjectList from '@/app/components/ProjectList';
import { getProjects } from '@/services/server/project/getProjects';
import OneTapComponent from '@/app/components/auth/GoogleOneTab';
import LoginBox from '@/app/components/auth/LoginBox';
import AutoSlidingBusinessCard from '../components/card/root/AutoSlidingBusinessCard';
import HeroCard from '../components/card/HeroCard';
import getMyAccount from '@/services/server/auth/getMyAccount';

export default async function Home() {
  const projects = await getProjects();

  const user = await getMyAccount();

  return (
    <div className="flex-col gap-4 w-full">
      <OneTapComponent />
      <div className="flex-center">
        <div className="h-[14.75rem] w-full justify-between flex mobile:justify-center">
          <div className="h-full w-[53.5rem] mobile:hidden bg-gray-50 rounded-[0.25rem]"></div>
          <AutoSlidingBusinessCard />
          {user ? <HeroCard /> : <LoginBox />}
        </div>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
