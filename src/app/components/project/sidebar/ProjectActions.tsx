'use client';

import { Body2 } from '@/app/components/system/text';
import RoundedButton from '@/app/components/system/RoundedButton';
import {
  IconPencil,
  IconPlayerPlayFilled,
  IconPlaylistAdd,
} from '@tabler/icons-react';

interface ProjectActionsProps {
  hasEditPermission?: boolean;
  onEdit?: () => void;
  links?: Array<{ url: string; title: string | null }>;
}

const ProjectActionButton = ({
  hasEditPermission,
  onEdit,
  links,
}: ProjectActionsProps) => {
  const handleClick = () => {
    if (hasEditPermission && onEdit) {
      onEdit();
      return;
    }
    const playLink = links?.find((link) => link.title === '/play');
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
      className="flex-1"
      gap={1}
      fullWidth={false}
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

export const ProjectActions = (props: ProjectActionsProps) => (
  <div className="flex w-full gap-1">
    <ProjectActionButton {...props} />
    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray-input cursor-pointer">
      <IconPlaylistAdd size={12} color="black" />
    </button>
  </div>
);

