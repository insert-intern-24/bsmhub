import { createClient } from '@/utils/supabase/client';

export default async function uploadProfileImage(
  file: File,
  bucket: string,
): Promise<string> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`${file.name}`, file, {
      cacheControl: '3600',
      upsert: false,
    });
  if (error) {
    console.error('Error uploading file:', error.message);
  }
  return (
    `{{supabaseHost}}/storage/v1/object/public/${bucket}/` + data?.path ||
    '{{supabaseHost}}/storage/v1/object/public/profile-image/default_profile.svg'
  );
}
