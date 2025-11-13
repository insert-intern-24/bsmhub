'use client';

import React, { useCallback } from 'react';
import { useModal } from '@/app/components/modal';
import { getProfileByStudentId } from '@/services/profile/getProfileApi.client';
import { projectConfig } from '@/services/config/projectConfig';
import ProjectEditModal from '@/app/components/project/components/ProjectEditModal';
import { useCurrentUser } from '@/utils/hook/useCurrentUser';

export const useCreateProject = () => {
  const currentUser = useCurrentUser();
  const { openModal, closeModal } = useModal();

  const handleMakeProject = useCallback(async (): Promise<void> => {
    if (!currentUser?.id) {
      console.error('User ID not available');
      alert('로그인이 필요합니다.');
      return;
    }

    // 프로필 가져오기 (owner로 사용하기 위해)
    const profile = await getProfileByStudentId(currentUser.id);
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
  }, [currentUser?.id, closeModal, openModal]);

  return handleMakeProject;
};

