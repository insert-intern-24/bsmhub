'use server';
import { createClient } from '@/utils/supabase/server';

const getUserIdBySession = async () => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user.id;
};

export default getUserIdBySession;
