'use client';

import { IconPencil } from '@tabler/icons-react';
import { useCallback } from 'react';
import { teamProfileConfig } from '@/services/config/teamProfileConfig';
import { useModal } from '../../modal';
import { useCurrentUser } from './useProfileEditor';
import ProfileEditModal from './ProfileEditModal';

interface TeamProfileEditButtonProps {
  profileId: string;
}

export default function TeamProfileEditButton({
  profileId,
}: TeamProfileEditButtonProps) {
  const currentUser = useCurrentUser();
  const { openModal, closeModal } = useModal();

  // 로그인하지 않은 경우 버튼을 렌더링하지 않음
  if (!currentUser) {
    return null;
  }

  const handleProfileEdit = useCallback(async () => {
    openModal(
      <ProfileEditModal
        config={teamProfileConfig}
        variables={{ profile_id: profileId }}
        mode="update"
        isTeam={true}
        onClose={closeModal}
      />,
    );
  }, [profileId, openModal, closeModal]);

  return (
    <button
      className="rounded-3xl h-10 flex justify-center items-center gap-4 bg-black text-white w-full"
      onClick={handleProfileEdit}
    >
      <IconPencil size={12}></IconPencil>
      Edit
    </button>
  );
}
