import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/services/supabase/database.types';
import { addLog } from '@/utils/performance/requestLogStore';

const fetchWithRetry = async (
  url: RequestInfo | URL,
  options: RequestInit = {},
) => {
  const MAX_RETRIES = 3;
  let lastError;

  for (let i = 0; i < MAX_RETRIES; i++) {
    const start = performance.now();
    try {
      const response = await fetch(url, {
        ...options,
        // @ts-expect-error - duplex is a valid option for node fetch but might not be in types
        duplex: 'half',
      });
      const end = performance.now();
      addLog({
        type: 'supabase',
        name: url.toString(),
        duration: end - start,
        timestamp: Date.now(),
        meta: { status: response.status, attempt: i + 1 },
      });
      return response;
    } catch (error) {
      const end = performance.now();
      addLog({
        type: 'supabase-error',
        name: url.toString(),
        duration: end - start,
        timestamp: Date.now(),
        meta: { error: String(error), attempt: i + 1 },
      });
      lastError = error;
      // Wait before retrying (exponential backoff: 100ms, 200ms, 400ms)
      await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, i)));
    }
  }
  throw lastError;
};

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
      global: {
        fetch: fetchWithRetry,
      },
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

