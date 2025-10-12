import { createClient } from '@/utils/supabase/server';

export default async function staticParamsGenerator(): Promise<string[]> {
  const supabase = await createClient(true);
  const { data, error } = await supabase
    .from('profile')
    .select('profile_name')
    .returns<{ profile_name: string }[]>();
  if (error) {
    console.error('Error fetching profile names:', error);
    return [];
  }
  return data?.map((profile) => profile.profile_name) || [];
}
