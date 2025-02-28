import { createClient } from '@/utils/supabase/server';

const LogoutTemplate = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();

  supabase.auth.signOut().then(() => {
    console.log('Signed out');
  });
  return children;
};
export default LogoutTemplate;
