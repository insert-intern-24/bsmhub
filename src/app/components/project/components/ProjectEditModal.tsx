'use client';

import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { useEffect } from 'react';
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import { formatErrorMessage } from '@/utils/errorMessage';
import { useToast } from '@/app/components/toast';
import type { MultiInputItem } from '@/app/components/modal/inputs/MultiInput';
import type { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';

interface ProjectEditModalProps {
  config: FormConfig;
  variables?: Record<string, unknown>;
  mode: 'create' | 'update';
  owner?: string; // create 모드일 때 사용
  onClose: () => void;
}

const ProjectEditModal = ({
  config,
  variables,
  mode,
  owner,
  onClose,
}: ProjectEditModalProps) => {
  const { showToast } = useToast();
  const finalMode = mode;

  const { initialValues, isLoading, saveData, error, canSave } =
    useFormConfigData(config, variables, {
      autoLoad: mode === 'update',
      mode: finalMode,
    });

  useEffect(() => {
    if (error) {
      showToast(error, 'error', 2000, '오류');
    }
  }, [error, showToast]);

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
        mode === 'create' && owner ? { owner } : undefined,
      );

      if (result.success) {
        onClose();
      } else {
        const errorMessage = formatErrorMessage(result.message, 'project');
        showToast(errorMessage, 'error', 2000, '오류');
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
    />
  );
};

export default ProjectEditModal;
