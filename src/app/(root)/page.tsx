import ProjectList from '@/app/components/HomeProjectList';
import { getProjects } from '@/services/project/getProjects.server';
import OneTapComponent from '@/app/components/auth/GoogleOneTab';
import LoginBox from '@/app/components/auth/LoginBox';
import AutoSlidingBusinessCard from '../components/card/root/AutoSlidingBusinessCard';
import HeroCard from '../components/card/HeroCard';
import getAccount from '@/services/auth/getAccount.server';

export default async function Home() {
  const projects = await getProjects();

  const user = await getAccount();

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
