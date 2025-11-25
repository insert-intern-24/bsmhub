import ProjectList from '@/app/components/feature/home/HomeProjectList';
import { getProjects } from '@/services/project/getProjects.server';
import OneTapComponent from '@/app/components/feature/auth/GoogleOneTab';
import LoginBox from '@/app/components/feature/auth/LoginBox';
import AutoSlidingBusinessCard from '../components/card/home/AutoSlidingBusinessCard';
import HeroCard from '../components/card/HeroCard';
import getAccount from '@/services/auth/getAccount.server';
import AutoCarousel from '../components/card/home/AutoCarousel';
import fs from 'node:fs';
import path from 'node:path';
import { sortProjectsByThumbnailAndGrade } from '@/utils/project/sortProjects';

const ALLOWED_EXTENSIONS = new Set(['.png']);

export default async function Home() {
  const projects = await getProjects();

  // 프로젝트 정렬
  const sortedProjects = sortProjectsByThumbnailAndGrade(projects);

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

  const carouselSlides = carouselImages.map((src, index) => ({
    src,
    href:
      index === 1
        ? 'https://sleepy-apple-8a6.notion.site/2b5d5ab3072f8074970ee64034050974'
        : undefined,
  }));

  return (
    <div className="flex-col gap-4 w-full">
      <OneTapComponent />
      <div className="flex-center">
        <div className="h-[19.4rem] w-full justify-between flex items-end mobile:justify-center mobile:h-[14.75rem]">
          <div className="h-full w-[54rem] mobile:hidden">
            <AutoCarousel images={carouselSlides} />
          </div>
          <div className="h-[14.75rem] mobile:w-full">
            <AutoSlidingBusinessCard />
          </div>
          <div className="h-[14.75rem] mobile:hidden">
            {user ? <HeroCard /> : <LoginBox />}
          </div>
        </div>
      </div>
      <ProjectList projects={sortedProjects} />
    </div>
  );
}
