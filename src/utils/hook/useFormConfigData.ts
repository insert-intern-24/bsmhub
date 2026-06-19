'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
    onSuccess?: (result: Result) => void; // 성공 시 콜백
    onError?: (error: Error) => void; // 에러 시 콜백
    /**
     * 무효화할 쿼리 키들
     * 제공되지 않으면 낙관적 업데이트를 건너뜀
     * 예: [['portfolios'], ['projects', profileName]]
     */
    invalidateQueries?: string[][];
    /**
     * 서버 컴포넌트를 사용하는 경우 refresh 여부
     * 기본값: false (낙관적 업데이트로 충분)
     */
    shouldRefresh?: boolean;
  },
) {
  const [initialValues, setInitialValues] = useState<
    Record<string, MultiInputItem[][] | string[] | boolean | File | string | null>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const router = useRouter();
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
   * Mutation을 사용한 데이터 저장 (낙관적 업데이트 포함)
   */
  const mutation = useMutation({
    mutationFn: async ({
      formData,
      additionalVariables,
    }: {
      formData: Record<
        string,
        MultiInputItem[][] | string[] | boolean | File | null | string
      >;
      additionalVariables?: Record<string, unknown>;
    }) => {
      if (!canSave) {
        throw new Error(`Save not allowed in ${mode} mode`);
      }

      // 이미지 업로드 처리 (파일 크기 검증 포함)
      const processedFormData = { ...formData };
      await Promise.all(
        formConfig.fields.map(async (field) => {
          if (
            field.type === 'picture' &&
            !field.multiple &&
            processedFormData[field.fieldName] instanceof File
          ) {
            processedFormData[field.fieldName] = await uploadProfileImage(
              processedFormData[field.fieldName] as File,
              field.bucket,
            );
          }
        }),
      );

      const result = await dataService.saveData(
        formConfig,
        processedFormData,
        { ...variables, ...additionalVariables },
        mode === 'update',
      );

      if (!result.success) {
        throw new Error(result.message || 'Failed to save data');
      }

      return result;
    },
    onMutate: async ({ formData, additionalVariables }) => {
      // 쿼리 키가 제공되지 않으면 낙관적 업데이트를 건너뜀
      const invalidateKeys = options?.invalidateQueries;
      
      if (!invalidateKeys || invalidateKeys.length === 0) {
        return { previousDataMap: null, invalidateKeys: [] };
      }
      
      // 낙관적 업데이트: 관련 쿼리들의 이전 데이터를 저장하여 롤백 가능하게 함
      const previousDataMap = new Map<string, unknown>();
      
      for (const key of invalidateKeys) {
        await queryClient.cancelQueries({ queryKey: key });
        const previousData = queryClient.getQueryData(key);
        if (previousData) {
          previousDataMap.set(JSON.stringify(key), previousData);
        }
      }

      return { previousDataMap, invalidateKeys };
    },
    onError: (error, _variables, context) => {
      // 에러 발생 시 이전 데이터로 롤백 (쿼리 키가 제공된 경우에만)
      if (context?.previousDataMap) {
        context.previousDataMap.forEach((previousData, keyStr) => {
          const key = JSON.parse(keyStr);
          queryClient.setQueryData(key, previousData);
        });
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to save data';
      setError(errorMessage);
      options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
    },
    onSuccess: (result, _variables, context) => {
      // 성공 시 관련 쿼리들을 무효화하여 서버에서 최신 데이터를 가져오도록 함
      const invalidateKeys = context?.invalidateKeys;
      
      if (invalidateKeys && invalidateKeys.length > 0) {
        // 모든 관련 쿼리 무효화
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      
      // 서버 컴포넌트를 사용하는 경우에만 refresh (옵션)
      if (options?.shouldRefresh) {
        router.refresh();
      }
      
      setError(null);
      options?.onSuccess?.(result);
    },
    onSettled: (_data, _error, _variables, context) => {
      // 쿼리 키가 제공된 경우에만 무효화
      const invalidateKeys = context?.invalidateKeys;
      if (invalidateKeys && invalidateKeys.length > 0) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
  });

  /**
   * 데이터 저장 (기존 API 호환성 유지)
   */
  const saveData = useCallback(
    async (
      formData: Record<
        string,
        MultiInputItem[][] | string[] | boolean | File | null | string
      >,
      additionalVariables?: Record<string, unknown>,
    ): Promise<Result> => {
      try {
        const result = await mutation.mutateAsync({
          formData,
          additionalVariables,
        });
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to save data';
        return {
          success: false,
          message: errorMessage,
        };
      }
    },
    [mutation],
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
    isSaving: mutation.isPending,
    error,
    saveData,
    reloadData,
    loadData,
    mode,
    canSave,
    mutation, // mutation 객체도 반환하여 직접 사용 가능
  };
}
