import ProjectList from '@/app/components/HomeProjectList';
import { getProjects } from '@/services/project/getProjects.server';
import OneTapComponent from '@/app/components/auth/GoogleOneTab';
import LoginBox from '@/app/components/auth/LoginBox';
import AutoSlidingBusinessCard from '../components/card/root/AutoSlidingBusinessCard';
import HeroCard from '../components/card/HeroCard';
import getAccount from '@/services/auth/getAccount.server';
import AutoCarousel from '../components/card/root/AutoCarousel';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import fs from 'node:fs';
import path from 'node:path';

const ALLOWED_EXTENSIONS = new Set(['.png']);

export default async function Home() {
  let projects: CardProps[] = [];
  try {
    projects = await getProjects();
  } catch (error) {
    console.error('프로젝트 로드 실패:', error);
    // 에러 발생 시 빈 배열 사용
  }

  const user = await getAccount();

  // public/card/Carousel 아래의 이미지를 모두 읽어와 캐러셀에 전달
  let carouselImages: string[] = [];
  try {
    const dir = path.join(process.cwd(), 'public', 'card', 'Carousel');
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) => ALLOWED_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    carouselImages = files.map((name) => `/card/Carousel/${name}`);
  } catch {
    carouselImages = [];
  }

  return (
    <div className="flex-col gap-4 w-full">
      <OneTapComponent />
      <div className="flex-center">
        <div className="h-[19.4rem] w-full justify-between flex items-end mobile:justify-center mobile:h-[14.75rem]">
          <div className="h-full w-[54rem] mobile:hidden">
            <AutoCarousel images={carouselImages} />
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
