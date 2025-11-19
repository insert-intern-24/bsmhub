'use client';

import { Body2 } from '@/app/components/ui/text/text';
import RoundedButton from '@/app/components/ui/button/RoundedButton';
import {
  IconPencil,
  IconPlayerPlayFilled,
  IconPlaylistAdd,
} from '@tabler/icons-react';

interface ProjectActionsSectionProps {
  hasEditPermission?: boolean;
  onEdit?: () => void;
  links?: Array<{ url: string; title: string | null }>;
}

const ProjectActionButton = ({
  hasEditPermission,
  onEdit,
  links,
}: ProjectActionsSectionProps) => {
  const playLink = links?.find((link) => link.title === '/play');
  const hasPlayLink = !!playLink;

  // Edit 권한이 없고 /play 링크도 없으면 버튼을 표시하지 않음
  if (!hasEditPermission && !hasPlayLink) {
    return null;
  }

  const handleClick = () => {
    if (hasEditPermission && onEdit) {
      onEdit();
      return;
    }
    if (playLink) {
      const newWindow = window.open(playLink.url, '_blank');
      if (!newWindow) {
        alert('팝업이 차단되었습니다. 사이트의 팝업 차단을 해제해주세요.');
      }
    }
  };

  return (
    <RoundedButton
      onClick={handleClick}
      className="flex-1 gap-1 w-auto"
    >
      {hasEditPermission ? (
        <>
          <IconPencil size={12} color="white" />
          <Body2 className="text-white">Edit</Body2>
        </>
      ) : (
        <>
          <IconPlayerPlayFilled size={12} color="white" />
          <Body2 className="text-white">Play</Body2>
        </>
      )}
    </RoundedButton>
  );
};

export const ProjectActionsSection = (props: ProjectActionsSectionProps) => (
  <div className="flex w-full gap-1">
    <ProjectActionButton {...props} />
    {props.hasEditPermission && (
      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray-input cursor-pointer">
        <IconPlaylistAdd size={12} color="black" />
      </button>
    )}
  </div>
);
