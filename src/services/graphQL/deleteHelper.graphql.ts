import { executeMutation } from './client.graphql.client';
import type { FormConfig } from '@/app/components/ui/input/types/inputTypes';

/**
 * 공통 삭제 핸들러 함수
 * @param config - FormConfig 객체
 * @param filter - 삭제할 레코드를 식별하는 필터
 * @returns 성공 메시지 문자열
 * @throws {Error} 삭제 중 오류 발생 시
 */
export const createDeleteHandler = async (
  config: FormConfig,
  filter: Record<string, unknown>,
  successMessage: string
): Promise<string> => {
  if (!config.graphql.delete) {
    throw new Error('삭제 쿼리가 설정되지 않았습니다.');
  }

  try {
    await executeMutation(config.graphql.delete, { filter });
    return successMessage;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    throw new Error(`삭제 중 오류가 발생했습니다: ${errorMessage}`);
  }
};
