import { MAX_FILE_SIZE_MB } from '@/shared/constants/upload';

/**
 * 에러 메시지를 사용자 친화적인 메시지로 변환
 */
export const formatErrorMessage = (
  errorMessage: string | undefined | null,
  entityType: 'profile' | 'project' = 'profile',
): string => {
  if (!errorMessage) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  // 중복 키 에러 처리
  if (
    errorMessage.includes('duplicate key') ||
    errorMessage.includes(`${entityType}_name_key`)
  ) {
    return entityType === 'profile'
      ? '이미 사용 중인 프로필 이름입니다. 다른 이름을 사용해주세요.'
      : '이미 사용 중인 프로젝트 이름입니다. 다른 이름을 사용해주세요.';
  }

  // Unique constraint 에러 처리
  if (errorMessage.includes('unique constraint')) {
    return '중복된 데이터가 존재합니다. 입력 내용을 확인해주세요.';
  }

  return errorMessage;
};

/**
 * Supabase Storage 업로드 에러를 파싱하여 한글 메시지로 변환
 * @param error Supabase Storage 에러 객체
 * @returns 한글로 변환된 에러 메시지
 */
export function parseSupabaseUploadError(error: {
  message?: string;
  statusCode?: number | string;
  error?: string;
}): string {
  let errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';
  
  // 파일 크기 초과 에러 처리
  // HTTP 413 (Payload Too Large) 또는 EntityTooLarge 에러 코드 확인
  if (
    error.statusCode === 413 ||
    error.statusCode === '413' ||
    error.error === 'EntityTooLarge' ||
    error.message === 'Payload too large'
  ) {
    errorMessage = `파일 크기가 최대 허용 크기(${MAX_FILE_SIZE_MB}MB)를 초과했습니다.`;
  }
  
  return errorMessage;
}
