'use client';

import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import { formatErrorMessage } from '@/utils/errorMessage';
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
  // 모드 결정
  const finalMode = mode;

  // useFormConfigData 훅을 사용하여 데이터 로딩 및 저장
  const { initialValues, isLoading, saveData, error, canSave } =
    useFormConfigData(config, variables, {
      autoLoad: mode === 'update', // create 모드일 때는 autoLoad false
      mode: finalMode,
    });

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
        console.log('프로젝트가 성공적으로 저장되었습니다.');
        console.log('Save result:', result);
        onClose();
      } else {
        console.error('프로젝트 저장 실패:', result.message);
        const errorMessage = formatErrorMessage(result.message, 'project');
        alert(`저장 중 오류가 발생했습니다:\n${errorMessage}`);
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

  if (error) {
    return <div className="p-8 text-center text-red-500">오류: {error}</div>;
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
