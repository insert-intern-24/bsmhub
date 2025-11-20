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

interface ProjectEditModalProps {
  config: FormConfig;
  variables?: Record<string, unknown>;
  mode: 'create' | 'update';
  onClose: () => void;
}

const ProjectEditModal = ({
  config,
  variables,
  mode,
  onClose,
}: ProjectEditModalProps) => {
  const router = useRouter();
  const { showToast } = useToast();

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
    <InputOfModal
      title={mode === 'update' ? '프로젝트 수정' : '프로젝트 만들기'}
      config={config}
      initialValues={initialValues}
      onSubmit={canSave ? handleProjectSubmit : undefined}
      onDelete={mode === 'update' ? handleProjectDelete : undefined}
      mode={mode}
    />
  );
};

export default ProjectEditModal;
