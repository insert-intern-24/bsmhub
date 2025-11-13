import { createClient } from '@/services/supabase/client';

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
  const supabase = createClient();

  const randomizedName = generateRandomFileName(file.name);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(randomizedName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  // 업로드 실패 시 기본 이미지 경로 반환
  if (error) {
    console.error('Error uploading file:', error.message);
    return '{{supabaseHost}}/storage/v1/object/public/profile-image/default_profile.svg';
  }

  // 업로드 성공 시 실제 경로 반환
  if (data?.path) {
    return `{{supabaseHost}}/storage/v1/object/public/${bucket}/${data.path}`;
  }

  return '{{supabaseHost}}/storage/v1/object/public/profile-image/default_profile.svg';
}
