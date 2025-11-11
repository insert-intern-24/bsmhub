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

  // 로그인하지 않았거나 소유자가 아니면 버튼을 렌더링하지 않음
  if (!currentUser || !isOwner) {
    return null;
  }

  return (
    <button
      className="rounded-3xl h-10 flex justify-center items-center gap-3 bg-black text-white w-full"
      onClick={handleProfileEdit}
    >
      <IconPencil size={12}></IconPencil>
      Edit
    </button>
  );
}
