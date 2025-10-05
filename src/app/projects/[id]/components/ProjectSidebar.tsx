'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { IconPlayerPlayFilled, IconPlaylistAdd } from '@tabler/icons-react';
import {
  Body,
  Body2,
  Label,
  Label2,
  TitleEN,
} from '@/app/components/system/text';
import SkillTag from '@/app/components/contents/SkillTag';
import type { ProjectDetailViewModel } from './types';

const PLAY_BUTTON_BORDER_STYLE: CSSProperties = {
  background: 'linear-gradient(180deg, #282A2B 0%, white 100%)',
  padding: '0.9px',
};

const PLAY_BUTTON_FILL_STYLE: CSSProperties = {
  background:
    'linear-gradient(170deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.4) 70%, rgba(255, 255, 255, 0.5) 100%), black',
};

const PLAY_BUTTON_SHEEN_STYLE: CSSProperties = {
  background:
    'linear-gradient(110deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.05) 100%)',
  pointerEvents: 'none',
};

const PLAY_BUTTON_TOP_GLOW_STYLE: CSSProperties = {
  background:
    'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)',
  pointerEvents: 'none',
};

const PLAY_BUTTON_BOTTOM_GLOW_STYLE: CSSProperties = {
  background:
    'linear-gradient(0deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%)',
  pointerEvents: 'none',
};

const PLAY_BUTTON_DEPTH_STYLE: CSSProperties = {
  background:
    'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)',
  zIndex: -1,
};

const FALLBACK_ICON = '/card/dummy-project-icon.png';
const FALLBACK_PROFILE = '/card/dummy-profile.png';

type ProjectSidebarProps = {
  project: ProjectDetailViewModel;
};

const ProjectSidebar = ({ project }: ProjectSidebarProps) => (
  <aside className="relative flex-shrink-0 w-[21.75rem] min-w-[21.75rem] border-r border-gray-200 px-[2.625rem] mobile:w-full mobile:min-w-0 mobile:border-0 mobile:px-0 mobile:pb-8">
    <ProjectIcon
      image={project.iconImage ?? FALLBACK_ICON}
      title={project.title}
    />
    <div className="flex-col w-full gap-[1.625rem]">
      <ProjectSummary
        title={project.title}
        description={project.shortDescription}
      />
      <ProjectLink url={project.githubUrl} />
      <ProjectTechnologies technologies={project.technologies} />
      <ProjectTeam members={project.team} />
    </div>
  </aside>
);

const ProjectIcon = ({ image, title }: { image: string; title: string }) => (
  <div className="absolute top-[-8rem] h-[7.5rem] w-[7.5rem]">
    <Image src={image} alt={title} fill className="object-cover" />
  </div>
);

const ProjectSummary = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <section className="flex-col w-full gap-[0.375rem]">
    <TitleEN>{title}</TitleEN>
    <Body className="text-detail">{description}</Body>
    <ProjectActions />
  </section>
);

const ProjectActions = () => (
  <div className="flex w-full gap-1">
    <PlayButton />
    <AddToPlaylistButton />
  </div>
);

const PlayButton = () => (
  <div className="relative flex-1">
    <div
      className="absolute inset-x-[0%] top-1/4 h-12"
      style={PLAY_BUTTON_DEPTH_STYLE}
    />
    <div
      className="relative flex h-10 items-center justify-center gap-1 overflow-hidden rounded-3xl"
      style={{ opacity: 0.8, backdropFilter: 'blur(33.5px)' }}
    >
      <div
        className="absolute inset-0 rounded-3xl"
        style={PLAY_BUTTON_BORDER_STYLE}
      >
        <div
          className="h-full w-full rounded-3xl"
          style={PLAY_BUTTON_FILL_STYLE}
        />
      </div>
      <div
        className="absolute inset-0 rounded-3xl"
        style={PLAY_BUTTON_SHEEN_STYLE}
      />
      <div
        className="absolute left-0 right-0 top-0 h-1/3 rounded-3xl"
        style={PLAY_BUTTON_TOP_GLOW_STYLE}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 rounded-3xl"
        style={PLAY_BUTTON_BOTTOM_GLOW_STYLE}
      />
      <div className="z-10 flex items-center justify-center gap-1">
        <IconPlayerPlayFilled size={(18 * 12) / 16} color="white" />
        <Body2 className="text-white">Play</Body2>
      </div>
    </div>
  </div>
);

const AddToPlaylistButton = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray-input">
    <IconPlaylistAdd size={(16 * 12) / 16} color="black" />
  </div>
);

const ProjectLink = ({ url }: { url?: string | null }) => (
  <section className="flex-col gap-[0.375rem]">
    <Label>링크</Label>
    <Label className="text-detail">{url ?? '등록된 링크가 없습니다.'}</Label>
  </section>
);

const ProjectTechnologies = ({ technologies }: { technologies: string[] }) => (
  <section className="flex-col gap-[0.375rem]">
    <Label>기술스택</Label>
    <div className="flex-row flex-wrap gap-2">
      {technologies.length > 0 ? (
        technologies.map((tech) => (
          <SkillTag key={tech} mode="default" value={tech} />
        ))
      ) : (
        <Label className="text-detail">기술 스택 정보가 없습니다.</Label>
      )}
    </div>
  </section>
);

const MOBILE_MEDIA_QUERY = '(max-width: 900px)';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY);

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQueryList.matches);

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', handleChange);

      return () => {
        mediaQueryList.removeEventListener('change', handleChange);
      };
    }

    mediaQueryList.addListener(handleChange);

    return () => {
      mediaQueryList.removeListener(handleChange);
    };
  }, []);

  return isMobile;
};

const ProjectTeam = ({
  members,
}: {
  members: ProjectDetailViewModel['team'];
}) => {
  const [isGradientVisible, setIsGradientVisible] = useState(true);
  const isMobile = useIsMobile();

  const handleReveal = () => {
    setIsGradientVisible(false);
  };

  const shouldFold = isMobile && members.length > 1 && isGradientVisible;
  const visibleMembers = shouldFold ? members.slice(0, 1) : members;

  return (
    <section className="relative flex-col gap-[0.375rem]">
      <Label>기여</Label>
      <div className="relative overflow-hidden">
        <div className="flex-col gap-[0.5rem] relative z-0">
          {visibleMembers.length > 0 ? (
            <>
              <TeamMemberItem member={visibleMembers[0]} />
              {visibleMembers.slice(1).map((member) => (
                <TeamMemberItem key={member.id} member={member} />
              ))}
            </>
          ) : (
            <Label className="text-detail">참여자 정보가 없습니다.</Label>
          )}
        </div>
      </div>
      {shouldFold && (
        <>
          <div className="pointer-events-none absolute inset-0 z-10 hidden bg-gradient-to-b from-white/70 via-white/85 to-white mobile:block" />
          <div className="absolute inset-x-0 bottom-0 z-20 hidden justify-center mobile:flex">
            <button
              type="button"
              className="pointer-events-auto px-4 py-1"
              onClick={handleReveal}
            >
              <Body className="text-gray-base">더보기</Body>
            </button>
          </div>
        </>
      )}
    </section>
  );
};

const TeamMemberItem = ({
  member,
}: {
  member: ProjectDetailViewModel['team'][number];
}) => (
  <article className="flex-row items-center gap-[0.375rem]">
    <div className="relative h-10 w-10 overflow-hidden rounded-full">
      <Image
        src={member.profileImage || FALLBACK_PROFILE}
        alt={member.name}
        fill
        className="object-cover"
      />
    </div>
    <div className="flex-col">
      <Label2 className="font-semibold">{member.name}</Label2>
      <Label className="text-gray-base">{member.role}</Label>
    </div>
  </article>
);

export default ProjectSidebar;
