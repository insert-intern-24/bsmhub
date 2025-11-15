'use client';

import InputOfModal from '../../modal/inputs/InputOfModal';
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import { formatErrorMessage } from '@/utils/errorMessage';
import type { MultiInputItem } from '@/app/components/modal/inputs/MultiInput';
import type { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { useRouter } from 'next/navigation';
import { createDeleteHandler } from '@/services/graphQL/deleteHelper.graphql';

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
  const router = useRouter();
  const isTeamValue = isTeam ?? false;
  
  // 모드 결정
  const finalMode = mode;

  // useFormConfigData 훅을 사용하여 데이터 로딩 및 저장
  const { initialValues, isLoading, saveData, error, canSave } =
    useFormConfigData(config, variables, {
      autoLoad: true,
      mode: finalMode,
    });

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
        console.log('프로필이 성공적으로 저장되었습니다.');
        console.log('Save result:', result);
        onClose();
        router.refresh();
      } else {
        console.error('프로필 저장 실패:', result.message);
        const errorMessage = formatErrorMessage(result.message, 'profile');
        alert(`저장 중 오류가 발생했습니다:\n${errorMessage}`);
      }
    })();
  };

  const handleProfileDelete = (): void => {
    void (async () => {
      try {
        await createDeleteHandler(
          config,
          { profile_id: { eq: variables.profile_id } },
          '프로필이 성공적으로 삭제되었습니다.'
        );
        onClose();
        router.refresh();
      } catch (err) {
        // 에러는 이미 createDeleteHandler에서 처리됨
        console.error('삭제 처리 중 오류:', err);
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
      onDelete={mode === 'update' ? handleProfileDelete : undefined}
      mode={mode}
    />
  );
};

export default ProfileEditModal;
