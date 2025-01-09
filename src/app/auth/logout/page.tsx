import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const Logout = async () => {
  const supabase = await createClient();

  supabase.auth.signOut().then(() => {
    console.log('Signed out');
  });
  return redirect('/');
};
export default Logout;
