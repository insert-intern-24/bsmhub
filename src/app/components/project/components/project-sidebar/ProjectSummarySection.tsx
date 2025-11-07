'use client';

import { Body, Body2, Label, TitleEN } from '@/app/components/system/text';
import SkillTag from '@/app/components/contents/SkillTag';
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
  projectId?: number;
  onEdit?: () => void;
}

export const ProjectSummarySection = ({
  title,
  description,
  hasEditPermission,
  projectId,
  onEdit,
}: ProjectSummarySectionProps) => (
  <section className="flex-col w-full gap-[0.375rem]">
    <TitleEN>{title}</TitleEN>
    <Body className="text-detail">{description}</Body>
    <ProjectActions
      hasEditPermission={hasEditPermission}
      projectId={projectId}
      onEdit={onEdit}
    />
  </section>
);

const ProjectActions = ({
  hasEditPermission,
  projectId,
  onEdit,
}: {
  hasEditPermission?: boolean;
  projectId?: number;
  onEdit?: () => void;
}) => (
  <div className="flex w-full gap-1">
    <PlayButton
      hasEditPermission={hasEditPermission}
      projectId={projectId}
      onEdit={onEdit}
    />
    <AddToPlaylistButton />
  </div>
);

const PlayButton = ({
  hasEditPermission,
  projectId,
  onEdit,
}: {
  hasEditPermission?: boolean;
  projectId?: number;
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
  url?: string | null;
}

export const ProjectLinkSection = ({ url }: ProjectLinkSectionProps) => (
  <section className="flex-col gap-[0.375rem]">
    <Label>링크</Label>
    {url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-detail cursor-pointer hover:underline"
      >
        <Label className="text-detail">{url}</Label>
      </a>
    ) : (
      <Label className="text-detail">등록된 링크가 없습니다.</Label>
    )}
  </section>
);

interface ProjectTechnologiesSectionProps {
  technologies: string[];
}

export const ProjectTechnologiesSection = ({
  technologies,
}: ProjectTechnologiesSectionProps) => (
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
