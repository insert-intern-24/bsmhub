'use client';

import { IconPencil } from '@tabler/icons-react';
import { useCallback } from 'react';
import { profileConfig } from '@/services/config/profileConfig';
import { useModal } from '../../modal';
import { useCurrentUser } from './useProfileEditor';
import ProfileEditModal from './ProfileEditModal';
import { checkProfileExistence } from '@/services/client/profile/profileApi';

interface ProfileEditButtonProps {
  ownerId: string;
  profileName?: string;
}

export default function ProfileEditButton({
  ownerId,
  profileName,
}: ProfileEditButtonProps) {
  const currentUser = useCurrentUser();
  const { openModal, closeModal } = useModal();

  // 권한 확인: 현재 사용자가 프로필 소유자인지 확인
  const isOwner = currentUser?.id === ownerId;

  const handleProfileEdit = useCallback(async () => {
    if (!currentUser?.id || !isOwner) {
      console.error('User not authorized to edit this profile');
      return;
    }

    // 프로필 존재 여부 확인
    const profileExists = await checkProfileExistence(ownerId);

    openModal(
      <ProfileEditModal
        config={profileConfig}
        variables={{ owner: ownerId }}
        mode={profileExists ? 'update' : 'create'}
        ownerId={ownerId}
        isTeam={false}
        onClose={closeModal}
      />,
    );
  }, [ownerId, currentUser?.id, isOwner, openModal, closeModal]);

  // profileName은 현재 사용하지 않지만, 향후 로깅이나 디버깅에 사용할 수 있음
  console.log('Editing profile:', profileName);

  return (
    <button
      className="rounded-3xl h-10 flex justify-center items-center gap-4 bg-black text-white w-full"
      onClick={handleProfileEdit}
      disabled={!currentUser || !isOwner}
    >
      <IconPencil size={12}></IconPencil>
      Edit
    </button>
  );
}
