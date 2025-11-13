'use client';

import React from 'react';
import { getProfileByStudentId } from '@/services/profile/getProfileApi.client';
import { projectConfig } from '@/services/config/projectConfig';
import ProjectEditModal from '@/app/components/project/components/ProjectEditModal';

/**
 * 프로젝트 생성 모달을 여는 유틸리티 함수
 * @param currentUserId - 현재 사용자 ID
 * @param openModal - 모달을 여는 함수
 * @param closeModal - 모달을 닫는 함수
 */
export async function openProjectModal(
  currentUserId: string,
  openModal: (content: React.ReactNode) => void,
  closeModal: () => void,
): Promise<void> {
  // 프로필 가져오기 (owner로 사용하기 위해)
  const profile = await getProfileByStudentId(currentUserId);
  if (!profile) {
    alert('프로필을 먼저 생성해주세요.');
    return;
  }

  openModal(
    <ProjectEditModal
      config={projectConfig}
      mode="create"
      owner={profile.profile_id}
      onClose={closeModal}
    />,
  );
}

