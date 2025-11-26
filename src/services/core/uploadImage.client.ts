import { createClient } from '@/services/supabase/client';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from '@/shared/constants/upload';
import { parseSupabaseUploadError } from '@/utils/errorMessage';

/**
 * 파일명에서 확장자만 추출하고, 확장자를 제외한 파일명을 랜덤하게 생성합니다.
 */
function generateRandomFileName(originalName: string): string {
  const hasExt = originalName.includes('.');
  const ext = hasExt ? `.${originalName.split('.').pop()}` : '';
  const uuid = `${Date.now()}-${crypto.randomUUID()}`;
  return `${uuid}${ext}`;
}

/**
 * 이미지 업로드 옵션
 */
export interface UploadImageOptions {
  /** 업로드할 파일 */
  file: File;
  /** Supabase Storage 버킷 이름 */
  bucket: string;
  /** 진행률 콜백 (선택사항) */
  onProgress?: (event: { progress: number }) => void;
  /** 업로드 취소를 위한 AbortSignal (선택사항) */
  abortSignal?: AbortSignal;
}

/**
 * Supabase Storage에 이미지를 업로드하는 공통 함수
 * @param options 업로드 옵션
 * @returns 업로드된 이미지의 URL
 */
export default async function uploadImage(
  options: UploadImageOptions,
): Promise<string> {
  const { file, bucket, onProgress, abortSignal } = options;

  // 프론트엔드에서 파일 크기 먼저 검증
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `파일 크기가 최대 허용 크기(${MAX_FILE_SIZE_MB}MB)를 초과했습니다.`,
    );
  }

  const supabase = createClient();
  const randomizedName = generateRandomFileName(file.name);

  // 진행률 추적을 위한 시뮬레이션 (실제 Supabase 업로드는 진행률을 직접 제공하지 않음)
  // 초기 진행률 보고
  onProgress?.({ progress: 0 });

  // AbortSignal 체크
  if (abortSignal?.aborted) {
    throw new Error('Upload cancelled');
  }

  try {
    // Supabase 스토리지에 업로드
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(randomizedName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    // AbortSignal 체크
    if (abortSignal?.aborted) {
      throw new Error('Upload cancelled');
    }

    // 업로드 실패 시 에러 발생
    if (error) {
      console.error('Error uploading file:', error);
      throw new Error(parseSupabaseUploadError(error));
    }

    // 진행률 100% 보고
    onProgress?.({ progress: 100 });

    // 업로드 성공 시 실제 경로 반환
    if (data?.path) {
      return `{{supabaseHost}}/storage/v1/object/public/${bucket}/${data.path}`;
    }

    throw new Error('이미지 업로드 후 경로를 가져올 수 없습니다.');
  } catch (error) {
    // AbortSignal로 인한 취소인 경우
    if (abortSignal?.aborted) {
      throw new Error('Upload cancelled');
    }

    // 다른 에러인 경우
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
}
