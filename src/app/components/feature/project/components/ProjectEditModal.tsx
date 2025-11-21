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
import { getProfileById } from '@/services/profile/getProfileApi.client';

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

        // GraphQL 응답에서 프로젝트 정보 추출
        const responseData = result.data as Record<string, unknown> | undefined;
        let projectName: string | null = null;
        let ownerId: string | null = null;

        if (responseData) {
          // Update 응답: updateprojectsCollection.records[0]
          const updateCollection = responseData.updateprojectsCollection as
            | { records?: Array<{ project_name?: string; owner?: string }> }
            | undefined;

          // Insert 응답: insertIntoprojectsCollection.records[0]
          const insertCollection = responseData.insertIntoprojectsCollection as
            | { records?: Array<{ project_name?: string; owner?: string }> }
            | undefined;

          const record = updateCollection?.records?.[0] || insertCollection?.records?.[0];

          if (record) {
            projectName = record.project_name || null;
            ownerId = record.owner || null;
          }
        }

        // 프로젝트 이름과 owner가 있으면 프로필 정보 조회 후 리다이렉트
        if (projectName && ownerId) {
          try {
            const profileInfo = await getProfileById(ownerId);
            if (profileInfo) {
              const basePath = profileInfo.is_team ? '/team' : '/portfolio';
              const encodedProfileName = encodeURIComponent(profileInfo.profile_name);
              const encodedProjectName = encodeURIComponent(projectName);
              router.push(`${basePath}/${encodedProfileName}/${encodedProjectName}`);
            } else {
              router.refresh();
            }
          } catch (error) {
            console.error('Failed to fetch profile info:', error);
            router.refresh();
          }
        } else {
          router.refresh();
        }
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

        // 프로젝트 삭제 후 해당 프로필 페이지로 리다이렉트
        // URL 형식: /portfolio/[profileName]/[projectName] 또는 /team/[teamName]/[projectName]
        const pathname = window.location.pathname;
        const pathParts = pathname.split('/').filter(Boolean);

        // pathParts: ['portfolio' | 'team', profileName, projectName]
        if (pathParts.length >= 2) {
          const basePath = pathParts[0]; // 'portfolio' 또는 'team'
          const profileName = pathParts[1];
          router.push(`/${basePath}/${profileName}`);
        } else {
          router.push('/project');
        }
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
