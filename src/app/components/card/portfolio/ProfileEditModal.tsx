'use client';

import { useEffect } from 'react';
import InputOfModal from '../../modal/inputs/InputOfModal';
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import { formatErrorMessage } from '@/utils/errorMessage';
import { useToast } from '@/app/components/toast';
import type { MultiInputItem } from '@/app/components/modal/inputs/MultiInput';
import type { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';

interface ProfileEditModalProps {
  config: FormConfig;
  variables: Record<string, unknown>;
  mode: 'create' | 'update';
  ownerId?: string;
  isTeam?: boolean;
  onClose: () => void;
}

const ProfileEditModal = ({
  config,
  variables,
  mode,
  ownerId,
  isTeam,
  onClose,
}: ProfileEditModalProps) => {
  const { showToast } = useToast();
  const isTeamValue = isTeam ?? false;
  const finalMode = mode;

  const { initialValues, isLoading, saveData, error, canSave } =
    useFormConfigData(config, variables, {
      autoLoad: true,
      mode: finalMode,
    });

  useEffect(() => {
    if (error) {
      showToast(error, 'error', 2000, '오류');
    }
  }, [error, showToast]);

  const handleProfileSubmit = (
    formData: Record<
      string,
      MultiInputItem[][] | string[] | boolean | File | number[] | null
    >,
  ): void => {
    void (async () => {
      const result = await saveData(
        formData as unknown as Record<
          string,
          MultiInputItem[][] | string[] | boolean | File | null | string
        >,
        isTeamValue
          ? { profile_id: variables.profile_id }
          : { owner: ownerId, is_team: isTeamValue },
      );

      if (result.success) {
        onClose();
      } else {
        const errorMessage = formatErrorMessage(result.message, 'profile');
        showToast(errorMessage, 'error', 2000, '오류');
      }
    })();
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        {isTeamValue
          ? '팀 프로필 정보를 불러오는 중...'
          : '프로필 정보를 불러오는 중...'}
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">오류: {error}</div>;
  }

  return (
    <InputOfModal
      title={
        mode === 'update'
          ? isTeamValue
            ? '팀 프로필 수정'
            : '프로필 수정'
          : '프로필 만들기'
      }
      config={config}
      initialValues={initialValues}
      onSubmit={canSave ? handleProfileSubmit : undefined}
    />
  );
};

export default ProfileEditModal;
