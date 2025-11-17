'use client';

import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import { useErrorToast } from '@/utils/hook/useErrorToast';
import { formatErrorMessage } from '@/utils/errorMessage';
import { useToast } from '@/app/components/toast';
import type { MultiInputItem } from '@/app/components/modal/inputs/MultiInput';
import type { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { useRouter } from 'next/navigation';
import { createDeleteHandler } from '@/services/graphQL/deleteHelper.graphql';
import { useState } from 'react';
import type { SelectableProfile } from '@/services/profile/getProfileApi.client';

interface ProjectEditModalProps {
  config: FormConfig;
  variables?: Record<string, unknown>;
  mode: 'create' | 'update';
  owner?: string; // update 모드일 때 사용
  selectableProfiles?: SelectableProfile[]; // create 모드일 때 사용
  onClose: () => void;
}

const ProjectEditModal = ({
  config,
  variables,
  mode,
  owner,
  selectableProfiles,
  onClose,
}: ProjectEditModalProps) => {
  const router = useRouter();
  const { showToast } = useToast();

  // create 모드일 때 선택된 소유자 관리
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>(
    mode === 'create' && selectableProfiles && selectableProfiles.length > 0
      ? selectableProfiles[0].profile_id
      : owner || '',
  );

  const finalMode = mode;

  const { initialValues, isLoading, saveData, error, canSave } =
    useFormConfigData(config, variables, {
      autoLoad: mode === 'update',
      mode: finalMode,
    });

  useErrorToast(error);

  const handleProjectSubmit = (
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
        mode === 'create' && selectedOwnerId
          ? { owner: selectedOwnerId }
          : undefined,
      );

      if (result.success) {
        const successMessage =
          mode === 'create'
            ? '프로젝트가 성공적으로 생성되었습니다.'
            : '프로젝트가 성공적으로 수정되었습니다.';
        showToast(successMessage, 'success', 3000, '성공');
        onClose();
        router.refresh();
      } else {
        const errorMessage = formatErrorMessage(result.message, 'project');
        showToast(errorMessage, 'error', 2000, '오류');
      }
    })();
  };

  const handleProjectDelete = (): void => {
    void (async () => {
      try {
        if (!variables?.project_id) {
          showToast('프로젝트 ID가 없습니다.', 'error', 3000, '오류');
          return;
        }
        const successMessage = await createDeleteHandler(
          config,
          { project_id: { eq: variables.project_id } },
          '프로젝트가 성공적으로 삭제되었습니다.'
        );
        showToast(successMessage, 'success', 3000, '성공');
        onClose();
        router.refresh();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.';
        showToast(errorMessage, 'error', 3000, '오류');
      }
    })();
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        프로젝트 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div>
      {mode === 'create' && selectableProfiles && selectableProfiles.length > 0 && (
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            소유자 프로필
          </label>
          <select
            value={selectedOwnerId}
            onChange={(e) => setSelectedOwnerId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {selectableProfiles.map((profile) => (
              <option key={profile.profile_id} value={profile.profile_id}>
                {profile.is_team ? '팀: ' : '개인: '}
                {profile.profile_name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            프로젝트를 생성할 소유자 프로필을 선택하세요
          </p>
        </div>
      )}
      <InputOfModal
        title={mode === 'update' ? '프로젝트 수정' : '프로젝트 만들기'}
        config={config}
        initialValues={initialValues}
        onSubmit={canSave ? handleProjectSubmit : undefined}
        onDelete={mode === 'update' ? handleProjectDelete : undefined}
        mode={mode}
      />
    </div>
  );
};

export default ProjectEditModal;
