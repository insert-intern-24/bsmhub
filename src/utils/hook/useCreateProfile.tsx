'use client';

import { useCallback } from 'react';
import { useModal } from '@/app/components/modal';
import { checkProfileExistence } from '@/services/profile/getProfileApi.client';
import { profileConfig } from '@/services/config/profileConfig';
import ProfileEditModal from '@/app/components/card/portfolio/ProfileEditModal';
import { useCurrentUser } from '@/utils/hook/useCurrentUser';

export const useCreateProfile = () => {
  const currentUser = useCurrentUser();
  const { openModal, closeModal } = useModal();

  const handleMakeProfile = useCallback(async (): Promise<void> => {
    if (!currentUser?.id) {
      console.error('User ID not available');
      alert('로그인이 필요합니다.');
      return;
    }

    // 프로필 존재 여부 확인
    const profileExists = await checkProfileExistence(currentUser.id);

    openModal(
      <ProfileEditModal
        config={profileConfig}
        variables={{ owner: currentUser.id }}
        mode={profileExists ? 'update' : 'create'}
        ownerId={currentUser.id}
        isTeam={false}
        onClose={closeModal}
      />,
    );
  }, [currentUser?.id, closeModal, openModal]);

  return handleMakeProfile;
};

