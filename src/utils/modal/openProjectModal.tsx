'use client';

import React from 'react';
import { projectConfig } from '@/services/config/projectConfig';
import ProjectEditModal from '@/app/components/project/components/ProjectEditModal';

/**
 * 프로젝트 생성 모달을 여는 유틸리티 함수
 * @param currentUserId - 현재 사용자 ID (사용하지 않지만 호환성 유지)
 * @param openModal - 모달을 여는 함수
 * @param closeModal - 모달을 닫는 함수
 */
export async function openProjectModal(
  currentUserId: string,
  openModal: (content: React.ReactNode) => void,
  closeModal: () => void,
): Promise<void> {
  openModal(
    <ProjectEditModal
      config={projectConfig}
      mode="create"
      onClose={closeModal}
    />,
  );
}

