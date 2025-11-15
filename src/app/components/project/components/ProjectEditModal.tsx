'use client';

import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import type { MultiInputItem } from '@/app/components/modal/inputs/MultiInput';
import type { FormConfig } from '@/app/components/modal/inputs/types/inputTypes';
import { useRouter } from 'next/navigation';
import { createDeleteHandler } from '@/services/graphQL/deleteHelper.graphql';

interface ProjectEditModalProps {
  config: FormConfig;
  variables: Record<string, unknown>;
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
  
  // 모드 결정
  const finalMode = mode;

  // useFormConfigData 훅을 사용하여 데이터 로딩 및 저장
  const { initialValues, isLoading, saveData, error, canSave } =
    useFormConfigData(config, variables, {
      autoLoad: true,
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
      );

      if (result.success) {
        console.log('프로젝트가 성공적으로 저장되었습니다.');
        console.log('Save result:', result);
        onClose();
        router.refresh();
      } else {
        console.error('프로젝트 저장 실패:', result.message);

        // 에러 메시지를 사용자 친화적으로 변환
        let errorMessage = result.message || '알 수 없는 오류가 발생했습니다.';

        if (
          errorMessage.includes('duplicate key') ||
          errorMessage.includes('project_name_key')
        ) {
          errorMessage =
            '이미 사용 중인 프로젝트 이름입니다. 다른 이름을 사용해주세요.';
        } else if (errorMessage.includes('unique constraint')) {
          errorMessage =
            '중복된 데이터가 존재합니다. 입력 내용을 확인해주세요.';
        }

        alert(`저장 중 오류가 발생했습니다:\n${errorMessage}`);
      }
    })();
  };

  const handleProjectDelete = (): void => {
    void (async () => {
      try {
        if (!variables?.project_id) {
          console.error('프로젝트 ID가 없습니다.');
          return;
        }
        await createDeleteHandler(
          config,
          { project_id: { eq: variables.project_id } },
          '프로젝트가 성공적으로 삭제되었습니다.'
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
      onDelete={mode === 'update' ? handleProjectDelete : undefined}
      mode={mode}
    />
  );
};

export default ProjectEditModal;
