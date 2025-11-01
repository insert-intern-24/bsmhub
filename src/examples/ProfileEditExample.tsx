"use client"

import React from 'react';
import { profileConfig } from '@/services/config/profileConfig';
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import type { MultiInputItem } from '@/app/components/modal/inputs/MultiInput';

/**
 * 프로필 편집 모달 사용 예시
 * useFormConfigData Hook을 사용한 범용 접근
 */
export default function ProfileEditExample() {
  // 사용자 ID (실제로는 auth에서 가져와야 함)
  const userId = 'current-user-id';
  

  // 범용 Hook 사용
  const { initialValues, isLoading, saveData } = useFormConfigData(
    profileConfig,
    { owner: userId }, // 필터 조건
  );

  const handleSubmit = (
    data: Record<
      string,
      MultiInputItem[][] | string[] | boolean | File | number[] | null | string
    >,
  ): void => {
    void (async () => {
      const result = await saveData(
        data as unknown as Record<
          string,
          MultiInputItem[][] | string[] | boolean | File | null | string
        >,
      );

      if (result.success) {
        console.log('프로필 저장 성공!', result.data);
      } else {
        console.error('프로필 저장 실패:', result.message);
      }
    })();
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <InputOfModal
      title="프로필 편집"
      config={profileConfig}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitButtonText="저장하기"
    />
  );
}
