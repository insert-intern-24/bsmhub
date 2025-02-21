'use server';
import { createClient } from '@/utils/supabase/server';

const getUserIdBySession = async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user?.id;
  } catch (error) {
    console.error('Failed to get authenticated user:', error);
    return null;
  }
};

export default getUserIdBySession;
