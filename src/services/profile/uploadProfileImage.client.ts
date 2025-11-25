import { createClient } from '@/services/supabase/client';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// 파일명에서 확장자만 추출하고, 확장자를 제외한 파일명을 랜덤하게 생성합니다.
function generateRandomFileName(originalName: string): string {
  const hasExt = originalName.includes('.');
  const ext = hasExt ? `.${originalName.split('.').pop()}` : '';
  const uuid = `${Date.now()}-${crypto.randomUUID()}`;
  return `${uuid}${ext}`;
}

export default async function uploadProfileImage(
  file: File,
  bucket: string,
): Promise<string> {
  // 프론트엔드에서 파일 크기 먼저 검증
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `파일 크기가 최대 허용 크기(${MAX_FILE_SIZE / (1024 * 1024)}MB)를 초과했습니다.`
    );
  }

  const supabase = createClient();

  const randomizedName = generateRandomFileName(file.name);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(randomizedName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  // 업로드 실패 시 에러 발생
  if (error) {
    console.error('Error uploading file:', error);
    
    // Supabase 에러 코드를 확인하여 한글로 변환
    let errorMessage = error.message;
    
    // 파일 크기 초과 에러 처리 (서버 측 검증)
    // HTTP 413 (Payload Too Large) 또는 EntityTooLarge 에러 코드 확인
    if (
      (error as any).statusCode === '413' || 
      (error as any).statusCode === 413 ||
      (error as any).error === 'EntityTooLarge' ||
      error.message === 'Payload too large'
    ) {
      errorMessage = '파일 크기가 최대 허용 크기(5MB)를 초과했습니다.';
    }
    
    throw new Error(errorMessage);
  }

  // 업로드 성공 시 실제 경로 반환
  if (data?.path) {
    return `{{supabaseHost}}/storage/v1/object/public/${bucket}/${data.path}`;
  }

  throw new Error('이미지 업로드 후 경로를 가져올 수 없습니다.');
}
