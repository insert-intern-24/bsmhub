import uploadImage from '@/services/core/uploadImage.client';
import { convertFromDatabaseImageURL } from '../supabase/imageHostConverter';

const BUCKET_NAME = 'project-html-description-image';

/**
 * 프로젝트 HTML 설명에 사용되는 이미지를 업로드합니다.
 * @param file 업로드할 파일
 * @param onProgress 진행률 콜백 (선택사항)
 * @param abortSignal 업로드 취소를 위한 AbortSignal (선택사항)
 * @returns 업로드된 이미지의 URL
 */
export default async function uploadProjectImage(
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal,
): Promise<string> {
  const url = await uploadImage({
    file,
    bucket: BUCKET_NAME,
    onProgress,
    abortSignal,
  });
  return convertFromDatabaseImageURL(url, true);
}


