import { Body, Body2, Label, TitleEN } from '@/app/components/system/text';
import SkillTag from '@/app/components/contents/SkillTag';
import {
  PLAY_BUTTON_BORDER_STYLE,
  PLAY_BUTTON_BOTTOM_GLOW_STYLE,
  PLAY_BUTTON_DEPTH_STYLE,
  PLAY_BUTTON_FILL_STYLE,
  PLAY_BUTTON_SHEEN_STYLE,
  PLAY_BUTTON_TOP_GLOW_STYLE,
} from './styles';
import { IconPlayerPlayFilled, IconPlaylistAdd } from '@tabler/icons-react';

interface ProjectSummarySectionProps {
  title: string;
  description: string;
}

export const ProjectSummarySection = ({
  title,
  description,
}: ProjectSummarySectionProps) => (
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

interface ProjectLinkSectionProps {
  url?: string | null;
}

export const ProjectLinkSection = ({ url }: ProjectLinkSectionProps) => (
  <section className="flex-col gap-[0.375rem]">
    <Label>링크</Label>
    <Label className="text-detail">{url ?? '등록된 링크가 없습니다.'}</Label>
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
