'use client';

import { IconPencil } from '@tabler/icons-react';
import { useCallback } from 'react';
import { teamProfileConfig } from '@/services/config/teamProfileConfig';
import { useModal } from '../../modal';
import { useCurrentUser } from './useProfileEditor';
import ProfileEditModal from './ProfileEditModal';

interface TeamProfileEditButtonProps {
  profileId: string;
  profileName?: string;
}

export default function TeamProfileEditButton({
  profileId,
  profileName,
}: TeamProfileEditButtonProps) {
  const currentUser = useCurrentUser();
  const { openModal, closeModal } = useModal();

  const handleProfileEdit = useCallback(async () => {
    if (!currentUser?.id) {
      console.error('User not logged in');
      return;
    }

    openModal(
      <ProfileEditModal
        config={teamProfileConfig}
        variables={{ profile_id: profileId }}
        mode="update"
        isTeam={true}
        onClose={closeModal}
      />,
    );
  }, [profileId, currentUser?.id, openModal, closeModal]);

  // profileName은 현재 사용하지 않지만, 향후 로깅이나 디버깅에 사용할 수 있음
  console.log('Editing team profile:', profileName);

  return (
    <button
      className="rounded-3xl h-10 flex justify-center items-center gap-4 bg-black text-white w-full"
      onClick={handleProfileEdit}
      disabled={!currentUser}
    >
      <IconPencil size={12}></IconPencil>
      Edit
    </button>
  );
}
