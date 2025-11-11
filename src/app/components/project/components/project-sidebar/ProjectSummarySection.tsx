'use client';

import { Body, Body2, Label, TitleEN } from '@/app/components/system/text';
import SkillTagProvider from '@/app/components/modal/inputs/SkillTagProvider';
import {
  PLAY_BUTTON_BORDER_STYLE,
  PLAY_BUTTON_BOTTOM_GLOW_STYLE,
  PLAY_BUTTON_FILL_STYLE,
  PLAY_BUTTON_SHEEN_STYLE,
  PLAY_BUTTON_TOP_GLOW_STYLE,
} from './styles';
import {
  IconPencil,
  IconPlayerPlayFilled,
  IconPlaylistAdd,
} from '@tabler/icons-react';

interface ProjectSummarySectionProps {
  title: string;
  description: string;
  hasEditPermission?: boolean;
  onEdit?: () => void;
}

export const ProjectSummarySection = ({
  title,
  description,
  hasEditPermission,
  onEdit,
}: ProjectSummarySectionProps) => (
  <section className="flex-col w-full gap-[0.375rem]">
    <TitleEN>{title}</TitleEN>
    <Body className="text-detail">{description}</Body>
    <ProjectActions
      hasEditPermission={hasEditPermission}
      onEdit={onEdit}
    />
  </section>
);

const ProjectActions = ({
  hasEditPermission,
  onEdit,
}: {
  hasEditPermission?: boolean;
  onEdit?: () => void;
}) => (
  <div className="flex w-full gap-1 mt-3">
    <PlayButton
      hasEditPermission={hasEditPermission}
      onEdit={onEdit}
    />
    <AddToPlaylistButton />
  </div>
);

const PlayButton = ({
  hasEditPermission,
  onEdit,
}: {
  hasEditPermission?: boolean;
  onEdit?: () => void;
}) => (
  <button
    className="relative flex-1 cursor-pointer"
    onClick={hasEditPermission && onEdit ? onEdit : undefined}
  >
    <div
      className="relative flex h-10 items-center justify-center gap-1 overflow-hidden rounded-3xl z-10"
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
        {hasEditPermission ? (
          <>
            <IconPencil size={(18 * 12) / 16} color="white" />
            <Body2 className="text-white">Edit</Body2>
          </>
        ) : (
          <>
            <IconPlayerPlayFilled size={(18 * 12) / 16} color="white" />
            <Body2 className="text-white">Play</Body2>
          </>
        )}
      </div>
    </div>
  </button>
);

const AddToPlaylistButton = () => (
  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray-input cursor-pointer">
    <IconPlaylistAdd size={(16 * 12) / 16} color="black" />
  </button>
);

interface ProjectLinkSectionProps {
  links: Array<{ url: string; title: string | null }>;
}

export const ProjectLinkSection = ({ links }: ProjectLinkSectionProps) => (
  <section className="flex-col gap-[0.375rem]">
    <Label>링크</Label>
    {links.length > 0 ? (
      <div className="flex-col gap-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-detail cursor-pointer hover:underline"
          >
            <Label className="text-detail">
              {link.title || link.url}
            </Label>
          </a>
        ))}
      </div>
    ) : (
      <Label className="text-detail">등록된 링크가 없습니다.</Label>
    )}
  </section>
);


export const ProjectTechnologiesSection = ({
  technologies,
}: {
  technologies: number[];
}) => (
  <section className="flex-col gap-[0.375rem]">
    <Label>기술스택</Label>
    <SkillTagProvider readOnly initialTags={technologies} />
  </section>
);
