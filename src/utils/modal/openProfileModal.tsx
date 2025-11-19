'use client';

import React from 'react';
import { checkProfileExistence } from '@/services/profile/getProfileApi.client';
import { profileConfig } from '@/services/config/profileConfig';
import ProfileEditModal from '@/app/components/shared/ProfileEditModal';

/**
 * 프로필 생성/수정 모달을 여는 유틸리티 함수
 * @param currentUserId - 현재 사용자 ID
 * @param openModal - 모달을 여는 함수
 * @param closeModal - 모달을 닫는 함수
 */
export async function openProfileModal(
  currentUserId: string,
  openModal: (content: React.ReactNode) => void,
  closeModal: () => void,
): Promise<void> {
  // 프로필 존재 여부 확인
  const profileExists = await checkProfileExistence(currentUserId);

  openModal(
    <ProfileEditModal
      config={profileConfig}
      variables={{ owner: currentUserId }}
      mode={profileExists ? 'update' : 'create'}
      ownerId={currentUserId}
      isTeam={false}
      onClose={closeModal}
    />,
  );
}

