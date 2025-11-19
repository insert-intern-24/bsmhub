'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AvatarImage from '@/app/components/shared/AvatarImage';

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
  profileName: string;
  projects: ProjectItem[];
}

interface BusinessCardProps {
  card: BusinessCardData;
}

// 상수
const MAX_VISIBLE_PROJECTS = 2;
const HIDDEN_SCROLLBAR_STYLE = {
  scrollbarWidth: 'none' as const,
  msOverflowStyle: 'none' as const,
};

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

const ProfileHeader = ({ card }: { card: BusinessCardData }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/portfolio/${card.profileName}`);
  };

  return (
    <div className="flex items-center justify-between w-full cursor-pointer" onClick={handleClick}>
      <div className="flex gap-[7px] grow items-center">
        <AvatarImage
          src={card.profileImage}
          name={card.name}
          size={{ width: 27, height: 27 }}
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
};

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

const BusinessCard = ({ card }: BusinessCardProps) => {
  return (
    <div className="box-border flex flex-col gap-[10px] items-start overflow-hidden p-[10px] rounded-[16px] w-[210px] max-w-[90%] mobile:w-full bg-white hover:-translate-y-2 transition-transform duration-300 ease-out hover:cursor-pointer">
      <ProfileHeader card={card} />
      <ProjectsSection projects={card.projects} />
    </div>
  );
};

export default BusinessCard;
export type { BusinessCardData, ProjectItem };
