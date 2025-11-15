'use client';

import React from 'react';
import { teamProfileConfig } from '@/services/config/teamProfileConfig';
import ProfileEditModal from '@/app/components/card/portfolio/ProfileEditModal';

/**
 * 팀 프로필 생성 모달을 여는 유틸리티 함수
 * @param currentUserId - 현재 사용자 ID
 * @param openModal - 모달을 여는 함수
 * @param closeModal - 모달을 닫는 함수
 */
export async function openTeamModal(
  currentUserId: string,
  openModal: (content: React.ReactNode) => void,
  closeModal: () => void,
): Promise<void> {
  openModal(
    <ProfileEditModal
      config={teamProfileConfig}
      variables={{ owner: currentUserId }}
      mode="create"
      ownerId={currentUserId}
      isTeam={true}
      onClose={closeModal}
    />,
  );
}

