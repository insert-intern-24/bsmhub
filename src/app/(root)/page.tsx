import ProjectList from '@/app/components/HomeProjectList';
import { getProjects } from '@/services/project/getProjects.server';
import OneTapComponent from '@/app/components/auth/GoogleOneTab';
import LoginBox from '@/app/components/auth/LoginBox';
import AutoSlidingBusinessCard from '../components/card/root/AutoSlidingBusinessCard';
import HeroCard from '../components/card/HeroCard';
import getAccount from '@/services/auth/getAccount.server';
import AutoCarousel from '../components/card/root/AutoCarousel';

export default async function Home() {
  const projects = await getProjects();

  const user = await getAccount();

  return (
    <div className="flex-col gap-4 w-full">
      <OneTapComponent />
      <div className="flex-center">
        <div className="h-[21rem] w-full justify-between flex items-end mobile:justify-center mobile:h-[14.75rem]">
          <div className="h-full w-[53.5rem] mobile:hidden overflow-visible">
            <AutoCarousel />
          </div>
          <div className="h-[14.75rem] mobile:w-full">
            <AutoSlidingBusinessCard />
          </div>
          <div className="h-[14.75rem] mobile:hidden">
            {user ? <HeroCard /> : <LoginBox />}
          </div>
        </div>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
