'use client';

import { useState, useEffect, useCallback } from 'react';
import { FormConfig } from '@/app/components/ui/input/types/inputTypes';
import { MultiInputItem } from '@/utils/hook/useInputList';
import {
  getGraphQLDataService,
  Result,
} from '@/services/core/dataService.graphql.client';
import uploadProfileImage from '@/services/profile/uploadProfileImage.client';

/**
 * FormConfig 기반 데이터 관리 Hook
 * 사용자 정의 GraphQL 쿼리 실행 + 데이터 매핑
 */
export type FormMode = 'create' | 'update' | 'read';

export function useFormConfigData(
  formConfig: FormConfig,
  variables?: Record<string, unknown>, // GraphQL variables (owner, filter 등)
  options?: {
    autoLoad?: boolean; // 자동으로 데이터 로드 (기본: true)
    mode?: FormMode; // 모달의 동작 모드 (기본: 'create')
    isUpdate?: boolean; // 업데이트 모드 여부 (deprecated, mode 사용 권장)
  },
) {
  const [initialValues, setInitialValues] = useState<
    Record<string, MultiInputItem[][] | string[] | boolean | File | string | null>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dataService = getGraphQLDataService();
  const autoLoad = options?.autoLoad !== false;

  // mode 결정 (isUpdate는 하위 호환성을 위해 유지)
  const mode: FormMode =
    options?.mode || (options?.isUpdate ? 'update' : 'create');

  // mode에 따른 동작 결정
  const shouldLoadData = autoLoad && (mode === 'update' || mode === 'read');
  const canSave = mode === 'create' || mode === 'update';

  /**
   * 데이터 로드
   */
  const loadData = useCallback(async () => {
    if (!variables || !shouldLoadData) {
      // variables가 없거나 로드할 필요가 없으면 빈 데이터 반환
      setInitialValues(dataService.getEmptyFormData(formConfig));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await dataService.loadData(formConfig, variables);
      setInitialValues(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Load data error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formConfig, variables, dataService, shouldLoadData]);

  /**
   * 데이터 저장
   */
  const saveData = useCallback(
    async (
      formData: Record<
        string,
        MultiInputItem[][] | string[] | boolean | File | null | string
      >,
      additionalVariables?: Record<string, unknown>,
    ): Promise<Result> => {
      if (!canSave) {
        return {
          success: false,
          message: `Save not allowed in ${mode} mode`,
        };
      }

      setIsSaving(true);
      setError(null);

      try {
        // 이미지 업로드 처리 (파일 크기 검증 포함)
        await Promise.all(
          formConfig.fields.map(async (field) => {
            if (
              field.type === 'picture' &&
              !field.multiple &&
              formData[field.fieldName] instanceof File
            ) {
              formData[field.fieldName] = await uploadProfileImage(
                formData[field.fieldName] as File,
                field.bucket,
              );
            }
          }),
        );

        const result = await dataService.saveData(
          formConfig,
          formData,
          { ...variables, ...additionalVariables },
          mode === 'update',
        );

        if (!result.success) {
          setError(result.message || 'Failed to save data');
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to save data';
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setIsSaving(false);
      }
    },
    [formConfig, variables, mode, canSave, dataService],
  );

  /**
   * 데이터 리로드
   */
  const reloadData = useCallback(() => {
    loadData();
  }, [loadData]);

  // 초기 데이터 로드 (마운트 시 한 번만)
  useEffect(() => {
    if (shouldLoadData) {
      loadData();
    } else {
      // 로드할 필요가 없으면 빈 데이터 설정
      setInitialValues(dataService.getEmptyFormData(formConfig));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 마운트 시 한 번만 실행

  return {
    initialValues,
    isLoading,
    isSaving,
    error,
    saveData,
    reloadData,
    loadData,
    mode,
    canSave,
  };
}
