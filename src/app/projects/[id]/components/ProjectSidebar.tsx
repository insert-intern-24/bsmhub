'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { IconPlayerPlayFilled, IconPlaylistAdd } from '@tabler/icons-react';
import { Body, Body2, Label, Label2, TitleEN } from '@/app/components/system/text';
import SkillTag from '@/app/components/contents/SkillTag';
import type { Project, TeamMember } from './types';

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

const PlayButton = () => (
  <div className="relative flex-1">
    <div className="absolute inset-x-[0%] top-1/4 h-12" style={PLAY_BUTTON_DEPTH_STYLE} />
    <div
      className="relative flex h-10 items-center justify-center gap-1 overflow-hidden rounded-3xl"
      style={{ opacity: 0.8, backdropFilter: 'blur(33.5px)' }}
    >
      <div className="absolute inset-0 rounded-3xl" style={PLAY_BUTTON_BORDER_STYLE}>
        <div className="h-full w-full rounded-3xl" style={PLAY_BUTTON_FILL_STYLE} />
      </div>
      <div className="absolute inset-0 rounded-3xl" style={PLAY_BUTTON_SHEEN_STYLE} />
      <div className="absolute left-0 right-0 top-0 h-1/3 rounded-3xl" style={PLAY_BUTTON_TOP_GLOW_STYLE} />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 rounded-3xl" style={PLAY_BUTTON_BOTTOM_GLOW_STYLE} />
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

const ProjectActions = () => (
  <div className="flex w-full gap-1">
    <PlayButton />
    <AddToPlaylistButton />
  </div>
);

const TeamMemberItem = ({ member }: { member: TeamMember }) => (
  <article className="flex-row items-center gap-[0.375rem]">
    <div className="relative h-10 w-10 overflow-hidden rounded-full">
      <Image src={member.profileImage} alt={member.name} fill className="object-cover" />
    </div>
    <div className="flex-col">
      <Label2 className="font-semibold">{member.name}</Label2>
      <Label className="text-gray-base">{member.role}</Label>
    </div>
  </article>
);

const ProjectTeam = ({ members }: { members: Project['team'] }) => (
  <section className="flex-col gap-[0.375rem]">
    <Label>기여</Label>
    <div className="flex-col gap-[0.5rem]">
      {members.map((member) => (
        <TeamMemberItem key={member.id} member={member} />
      ))}
    </div>
  </section>
);

const ProjectTechnologies = ({ technologies }: { technologies: Project['technologies'] }) => (
  <section className="flex-col gap-[0.375rem]">
    <Label>기술스택</Label>
    <div className="flex-row flex-wrap gap-2">
      {technologies.map((tech) => (
        <SkillTag key={tech} mode="default" value={tech} />
      ))}
    </div>
  </section>
);

const ProjectLink = ({ url }: { url: string }) => (
  <section className="flex-col gap-[0.375rem]">
    <Label>링크</Label>
    <Label className="text-detail">{url}</Label>
  </section>
);

const ProjectSummary = ({ project }: { project: Project }) => (
  <section className="flex-col w-full gap-[0.375rem]">
    <TitleEN>{project.title}</TitleEN>
    <Body className="text-detail">{project.description}</Body>
    <ProjectActions />
  </section>
);

const ProjectIcon = ({ image, title }: { image: string; title: string }) => (
  <div className="absolute top-[-8rem] h-[7.5rem] w-[7.5rem]">
    <Image src={image} alt={title} fill className="object-cover" />
  </div>
);

const ProjectSidebar = ({ project }: { project: Project }) => (
  <aside className="relative flex-shrink-0 w-[21.75rem] min-w-[21.75rem] border-r border-gray-200 px-[2.625rem]">
    <ProjectIcon image={project.iconImage} title={project.title} />
    <div className="flex-col w-full gap-[1.625rem]">
      <ProjectSummary project={project} />
      <ProjectLink url={project.githubUrl} />
      <ProjectTechnologies technologies={project.technologies} />
      <ProjectTeam members={project.team} />
    </div>
  </aside>
);

export default ProjectSidebar;
