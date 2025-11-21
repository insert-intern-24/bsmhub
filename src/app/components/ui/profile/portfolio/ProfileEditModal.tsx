'use client';

import InputOfModal from '@/app/components/ui/input/InputOfModal';
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import { useErrorToast } from '@/utils/hook/useErrorToast';
import { formatErrorMessage } from '@/utils/errorMessage';
import { useToast } from '@/app/components/toast';
import type { MultiInputItem } from '@/app/components/ui/input/MultiInput';
import type { FormConfig } from '@/app/components/ui/input/types/inputTypes';
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
  const { showToast } = useToast();
  const isTeamValue = isTeam ?? false;

  const finalMode = mode;

  const { initialValues, isLoading, saveData, error, canSave } =
    useFormConfigData(config, variables, {
      autoLoad: true,
      mode: finalMode,
    });

  useErrorToast(error);

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
        const successMessage =
          mode === 'create'
            ? isTeamValue
              ? '팀 프로필이 성공적으로 생성되었습니다.'
              : '프로필이 성공적으로 생성되었습니다.'
            : isTeamValue
              ? '팀 프로필이 성공적으로 수정되었습니다.'
              : '프로필이 성공적으로 수정되었습니다.';
        showToast(successMessage, 'success', 3000, '성공');
        onClose();

        // GraphQL 응답에서 프로필 정보 추출
        const responseData = result.data as Record<string, unknown> | undefined;
        let profileName: string | null = null;
        let isTeam = isTeamValue;

        if (responseData) {
          // Update 응답: updateprofileCollection.records[0]
          const updateCollection = responseData.updateprofileCollection as
            | { records?: Array<{ profile_name?: string; is_team?: boolean }> }
            | undefined;

          // Insert 응답: insertIntoprofileCollection.records[0]
          const insertCollection = responseData.insertIntoprofileCollection as
            | { records?: Array<{ profile_name?: string; is_team?: boolean }> }
            | undefined;

          const record = updateCollection?.records?.[0] || insertCollection?.records?.[0];

          if (record) {
            profileName = record.profile_name || null;
            if (record.is_team !== undefined) {
              isTeam = record.is_team;
            }
          }
        }

        // 프로필 이름이 있으면 해당 페이지로 리다이렉트, 없으면 refresh
        if (profileName) {
          const basePath = isTeam ? '/team' : '/portfolio';
          const encodedProfileName = encodeURIComponent(profileName);
          router.push(`${basePath}/${encodedProfileName}`);
        } else {
          router.refresh();
        }
      } else {
        const errorMessage = formatErrorMessage(result.message, 'profile');
        showToast(errorMessage, 'error', 2000, '오류');
      }
    })();
  };

  const handleProfileDelete = (): void => {
    void (async () => {
      try {
        if (!variables?.profile_id) {
          showToast('프로필 ID가 없습니다.', 'error', 3000, '오류');
          return;
        }
        const successMessage = await createDeleteHandler(
          config,
          { profile_id: { eq: variables.profile_id } },
          '프로필이 성공적으로 삭제되었습니다.'
        );
        showToast(successMessage, 'success', 3000, '성공');
        onClose();

        // 프로필 삭제 후 목록 페이지로 리다이렉트
        const basePath = isTeamValue ? '/team' : '/portfolio';
        router.push(basePath);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.';
        showToast(errorMessage, 'error', 3000, '오류');
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
