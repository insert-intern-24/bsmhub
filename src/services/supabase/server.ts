import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/services/supabase/database.types';
import {
  getCookiePrefixes,
  duplicateCookiesForInternalUrl,
  filterOutInternalPrefixCookies,
} from '@/services/supabase/cookieUtils';

/**
 * Supabase 요청에 대한 재시도 로직을 포함한 fetch wrapper
 * @param url - 요청할 URL
 * @param options - fetch options
 * @returns fetch Response
 * @throws 최대 재시도 횟수 초과 시 마지막 에러 발생
 */
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
      const duration = end - start;
      const method = options.method || 'GET';

      const logMsg = `[Supabase] ${method} ${url} - ${duration.toFixed(
        2,
      )}ms (Status: ${response.status})`;
      if (duration > 500) {
        console.warn(`\x1b[33m${logMsg} [SLOW]\x1b[0m`);
      } else {
        console.log(logMsg);
      }

      return response;
    } catch (error) {
      const end = performance.now();
      console.error(
        `[Supabase Error] ${options.method || 'GET'} ${url} - ${(
          end - start
        ).toFixed(2)}ms`,
        error,
      );
      lastError = error;
      // Wait before retrying (exponential backoff: 100ms, 200ms, 400ms)
      await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, i)));
    }
  }
  throw lastError;
};

export async function createClient(useExternalUrl = false, anon = false) {
  const cookieStore = !anon
    ? await cookies()
    : {
        getAll() {
          return [];
        },
        set() {},
      };

  const prefixes = getCookiePrefixes();

  return createServerClient<Database>(
    useExternalUrl
      ? process.env.NEXT_PUBLIC_SUPABASE_URL!
      : process.env.NEXT_PUBLIC_SUPABASE_INTERNAL_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: fetchWithRetry,
      },
      cookies: {
        getAll() {
          // sb-bsmhub-* 쿠키를 sb-10-* 형식으로 복제하여 반환 (실제 저장 없음)
          return duplicateCookiesForInternalUrl(
            cookieStore.getAll(),
            prefixes,
          );
        },
        setAll(cookiesToSet) {
          try {
            // useExternalUrl이 false일 때만 sb-10-* 쿠키 필터링
            const cookiesToActuallySet = !useExternalUrl
              ? filterOutInternalPrefixCookies(cookiesToSet, prefixes)
              : cookiesToSet;
            cookiesToActuallySet.forEach(({ name, value, options }) => {
              // Ensure cookies are set with path=/ for cross-path sharing
              cookieStore.set(name, value, {
                ...options,
                path: '/',
                sameSite:
                  (options?.sameSite as 'lax' | 'strict' | 'none') || 'lax',
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
