import { createClient } from '@/utils/supabase/server';

export default async function getMyAccount() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}
