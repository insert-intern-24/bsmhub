import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/services/supabase/database.types';

export async function createClient(anon = false) {
  const cookieStore = !anon
    ? await cookies()
    : {
        getAll() {
          return [];
        },
        set() {},
      };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Ensure cookies are set with path=/ for cross-path sharing
              cookieStore.set(name, value, {
                ...options,
                path: '/',
                sameSite: (options?.sameSite as 'lax' | 'strict' | 'none') || 'lax',
              });
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      auth: {
        detectSessionInUrl: false,
        persistSession: true,
      },
    },
  );
}

