'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ProfileImage from '@components/card/portfolio/components/ProfileImage';

interface ProjectItem {
  id: string;
  title: string;
  image: string;
}

interface BusinessCardData {
  id: string;
  name: string;
  department: string;
  profileImage: string;
  projects: ProjectItem[];
}

interface AutoSlidingBusinessCardProps {
  cards?: BusinessCardData[];
}

const DEFAULT_CARDS: BusinessCardData[] = [
  {
    id: '1',
    name: '홍길동',
    department: '소프트웨어개발과',
    profileImage: '/default-avatar.svg',
    projects: [
      { id: '1', title: '산뜻 - SANDDEOT', image: '/default-avatar.svg' },
      { id: '2', title: 'FindOut', image: '/default-avatar.svg' },
      { id: '3', title: 'FindOut', image: '/default-avatar.svg' },
    ],
  },
  {
    id: '2',
    name: '홍길동',
    department: '소프트웨어개발과',
    profileImage: '/default-avatar.svg',
    projects: [
      { id: '1', title: '산뜻 - SANDDEOT', image: '/default-avatar.svg' },
      { id: '2', title: 'FindOut', image: '/default-avatar.svg' },
      { id: '3', title: 'FindOut', image: '/default-avatar.svg' },
    ],
  },
  {
    id: '3',
    name: '홍길동',
    department: '소프트웨어개발과',
    profileImage: '/default-avatar.svg',
    projects: [
      { id: '1', title: '산뜻 - SANDDEOT', image: '/default-avatar.svg' },
      { id: '2', title: 'FindOut', image: '/default-avatar.svg' },
      { id: '3', title: 'FindOut', image: '/default-avatar.svg' },
    ],
  },
];

const SLIDE_INTERVAL = 3000;
const TRANSITION_DURATION = 1000;
const MAX_VISIBLE_PROJECTS = 2;

const GRADIENT_BG = `url('data:image/svg+xml;utf8,<svg viewBox="0 0 264 186.91" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect x="0" y="0" height="100%" width="100%" fill="url(%23grad)" opacity="1"/><defs><radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(24.817 17.664 -24.949 72.133 7.5039 10.275)"><stop stop-color="rgba(255,255,255,1)" offset="0"/><stop stop-color="rgba(248,246,255,1)" offset="1"/></radialGradient></defs></svg>')`;

const HIDDEN_SCROLLBAR_STYLE = {
  scrollbarWidth: 'none' as const,
  msOverflowStyle: 'none' as const,
};

const AutoSlidingBusinessCard = ({ cards = [] }: AutoSlidingBusinessCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayCards = cards.length > 0 ? cards : DEFAULT_CARDS;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayCards.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [displayCards.length]);

  return (
    <article className="relative flex items-center justify-center h-full w-[26rem] mobile:w-full mobile:h-[15rem] bg-[#D7EFFF] rounded-[0.25rem] overflow-hidden">
      {/* 배경 이미지들 */}
      <Image 
        src="/card/AutoSlidingBusinessCard/bottom.svg" 
        alt="bottom" 
        width={139} 
        height={200}
        className="absolute left-[calc(7.5/17*100%)] top-[5px] -translate-x-1/2 z-0"
        priority
      />
      <Image
        src="/card/AutoSlidingBusinessCard/top.svg"
        alt="top"
        width={193}
        height={87}
        className="absolute left-1/2 bottom-0 -translate-x-1/2 z-10"
        priority
      />

      <div className="relative w-full h-full overflow-hidden">
        <div
          className="flex transition-transform ease-in-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transitionDuration: `${TRANSITION_DURATION}ms`,
          }}
        >
          {displayCards.map((card) => (
            <div
              key={card.id}
              className="min-w-full flex-shrink-0 flex items-center justify-center px-4 py-2"
            >
              <CardContent card={card} />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

interface CardContentProps {
  card: BusinessCardData;
}

const ArrowIcon = () => (
  <svg
    className="w-[8px] h-[8px]"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
      fill="#616161"
    />
  </svg>
);

const ProfileHeader = ({ card }: { card: BusinessCardData }) => (
  <div className="flex items-center justify-between w-full">
    <div className="flex gap-[7px] grow items-center">
      <ProfileImage
        src={card.profileImage}
        name={card.name}
        size="small"
        className="shrink-0"
        style={{ width: '27px', height: '27px' }}
      />
      <div className="flex flex-col grow items-start leading-[1.25] text-[#24292f]">
        <p className="font-bold text-[12px] tracking-[-0.8px] w-full">
          {card.name}
        </p>
        <p className="font-normal text-[7px] tracking-[-0.5px] w-full">
          {card.department}
        </p>
      </div>
    </div>
    <div className="flex items-center shrink-0">
      <p className="font-normal leading-[1.25] text-[#616161] text-[7px] text-nowrap tracking-[-0.5px] whitespace-pre">
        자세히 보기
      </p>
      <div className="flex items-center justify-center shrink-0 ml-1">
        <div className="flex-none rotate-180">
          <ArrowIcon />
        </div>
      </div>
    </div>
  </div>
);

const ProjectCard = ({ project }: { project: ProjectItem }) => (
  <div className="flex flex-col gap-[2px] items-start flex-1 min-w-0">
    <div className="relative h-[51px] rounded-[4px] shrink-0 w-full overflow-hidden">
      <Image
        src={project.image}
        alt={project.title}
        width={93}
        height={51}
        className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] w-full h-full"
      />
    </div>
    <p className="font-normal leading-[1.25] text-[#616161] text-[7px] tracking-[-0.5px] w-full truncate">
      {project.title}
    </p>
  </div>
);

const ProjectsSection = ({ projects }: { projects: ProjectItem[] }) => (
  <div className="flex flex-col gap-[4px] items-start w-full">
    <p className="font-bold leading-[1.25] text-[#616161] text-[10px] tracking-[-0.7px] w-full">
      프로젝트
    </p>
    <div
      className="flex gap-[4px] items-center overflow-x-auto overflow-y-clip w-full project-scroll"
      style={HIDDEN_SCROLLBAR_STYLE}
    >
      {projects.slice(0, MAX_VISIBLE_PROJECTS).map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  </div>
);

const CardContent = ({ card }: CardContentProps) => (
  <div
    className="box-border flex flex-col gap-[10px] items-start overflow-hidden p-[10px] rounded-[16px] w-[210px] max-w-[90%] mobile:w-full"
    style={{ backgroundImage: GRADIENT_BG }}
  >
    <ProfileHeader card={card} />
    <ProjectsSection projects={card.projects} />
  </div>
);

export default AutoSlidingBusinessCard;