"use client"

import React from 'react';
import { profileConfig } from '@/services/config/profileConfig';
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import InputOfModal from '@/app/components/modal/inputs/InputOfModal';

/**
 * 프로필 편집 모달 사용 예시
 * useFormConfigData Hook을 사용한 범용 접근
 */
export default function ProfileEditExample() {
  // 사용자 ID (실제로는 auth에서 가져와야 함)
  const userId = 'current-user-id';
  const profileId = 'existing-profile-id'; // 업데이트인 경우

  // 범용 Hook 사용
  const { initialValues, isLoading, saveData } = useFormConfigData(
    profileConfig,
    { owner: userId }, // 필터 조건
    {
      recordId: profileId, // 업데이트할 레코드 ID
      userId: userId, // owner로 설정될 ID
    }
  );

  const handleSubmit = async (data: any) => {
    const result = await saveData(data);

    if (result.success) {
      console.log('프로필 저장 성공!', result.data);
      // 성공 처리 (모달 닫기 등)
    } else {
      console.error('프로필 저장 실패:', result.message);
      // 에러 처리
    }
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
