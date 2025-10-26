'use client';

import { useEffect, useState } from 'react';
import { useModal } from '@/app/components/modal';
import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { profileConfig } from '@/services/config/profileConfig';

// 온보딩 모달 관리 Hook
export const useOnboardingModal = (isLoggedIn: boolean, profileExists: boolean, isProfileLoading: boolean) => {
  const [hasShownModal, setHasShownModal] = useState(false);
  const { openModal, closeModal } = useModal();

  const handleProfileSubmit = () => closeModal();

  useEffect(() => {
    if (isLoggedIn && !isProfileLoading && profileExists === false && !hasShownModal) {
      setHasShownModal(true);
      openModal(
        <InputOfModal
          title="프로필 설정"
          config={profileConfig}
          onSubmit={handleProfileSubmit}
        />
      );
    }
  }, [isLoggedIn, isProfileLoading, profileExists, hasShownModal]);

  const resetModal = () => setHasShownModal(false);

  return { resetModal };
};
