import uploadImage from '@/services/core/uploadImage.client';

/**
 * 프로필 이미지를 업로드합니다.
 * @param file 업로드할 파일
 * @param bucket Supabase Storage 버킷 이름
 * @returns 업로드된 이미지의 URL
 */
export default async function uploadProfileImage(
  file: File,
  bucket: string,
): Promise<string> {
  return uploadImage({ file, bucket });
}

