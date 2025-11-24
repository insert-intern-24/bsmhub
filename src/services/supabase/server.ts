import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/services/supabase/database.types';

interface CookieSerializeOptions {
  /**
   * Specifies the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.3|Domain Set-Cookie attribute}. By default, no
   * domain is set, and most clients will consider the cookie to apply to only
   * the current domain.
   */
  domain?: string | undefined;

  /**
   * Specifies a function that will be used to encode a cookie's value. Since
   * value of a cookie has a limited character set (and must be a simple
   * string), this function can be used to encode a value into a string suited
   * for a cookie's value.
   *
   * The default function is the global `encodeURIComponent`, which will
   * encode a JavaScript string into UTF-8 byte sequences and then URL-encode
   * any that fall outside of the cookie range.
   */
  encode?(value: string): string;

  /**
   * Specifies the `Date` object to be the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.1|`Expires` `Set-Cookie` attribute}. By default,
   * no expiration is set, and most clients will consider this a "non-persistent cookie" and will delete
   * it on a condition like exiting a web browser application.
   *
   * *Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3|cookie storage model specification}
   * states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
   * possible not all clients by obey this, so if both are set, they should
   * point to the same date and time.
   */
  expires?: Date | undefined;
  /**
   * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.6|`HttpOnly` `Set-Cookie` attribute}.
   * When truthy, the `HttpOnly` attribute is set, otherwise it is not. By
   * default, the `HttpOnly` attribute is not set.
   *
   * *Note* be careful when setting this to true, as compliant clients will
   * not allow client-side JavaScript to see the cookie in `document.cookie`.
   */
  httpOnly?: boolean | undefined;
  /**
   * Specifies the number (in seconds) to be the value for the `Max-Age`
   * `Set-Cookie` attribute. The given number will be converted to an integer
   * by rounding down. By default, no maximum age is set.
   *
   * *Note* the {@link https://tools.ietf.org/html/rfc6265#section-5.3|cookie storage model specification}
   * states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
   * possible not all clients by obey this, so if both are set, they should
   * point to the same date and time.
   */
  maxAge?: number | undefined;
  /**
   * Specifies the `boolean` value for the [`Partitioned` `Set-Cookie`](rfc-cutler-httpbis-partitioned-cookies)
   * attribute. When truthy, the `Partitioned` attribute is set, otherwise it is not. By default, the
   * `Partitioned` attribute is not set.
   *
   * **note** This is an attribute that has not yet been fully standardized, and may change in the future.
   * This also means many clients may ignore this attribute until they understand it.
   *
   * More information about can be found in [the proposal](https://github.com/privacycg/CHIPS)
   */
  partitioned?: boolean | undefined;
  /**
   * Specifies the value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.4|`Path` `Set-Cookie` attribute}.
   * By default, the path is considered the "default path".
   */
  path?: string | undefined;
  /**
   * Specifies the `string` to be the value for the [`Priority` `Set-Cookie` attribute][rfc-west-cookie-priority-00-4.1].
   *
   * - `'low'` will set the `Priority` attribute to `Low`.
   * - `'medium'` will set the `Priority` attribute to `Medium`, the default priority when not set.
   * - `'high'` will set the `Priority` attribute to `High`.
   *
   * More information about the different priority levels can be found in
   * [the specification][rfc-west-cookie-priority-00-4.1].
   *
   * **note** This is an attribute that has not yet been fully standardized, and may change in the future.
   * This also means many clients may ignore this attribute until they understand it.
   */
  priority?: 'low' | 'medium' | 'high' | undefined;
  /**
   * Specifies the boolean or string to be the value for the {@link https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7|`SameSite` `Set-Cookie` attribute}.
   *
   * - `true` will set the `SameSite` attribute to `Strict` for strict same
   * site enforcement.
   * - `false` will not set the `SameSite` attribute.
   * - `'lax'` will set the `SameSite` attribute to Lax for lax same site
   * enforcement.
   * - `'strict'` will set the `SameSite` attribute to Strict for strict same
   * site enforcement.
   *  - `'none'` will set the SameSite attribute to None for an explicit
   *  cross-site cookie.
   *
   * More information about the different enforcement levels can be found in {@link https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7|the specification}.
   *
   * *note* This is an attribute that has not yet been fully standardized, and may change in the future. This also means many clients may ignore this attribute until they understand it.
   */
  sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined;
  /**
   * Specifies the boolean value for the {@link https://tools.ietf.org/html/rfc6265#section-5.2.5|`Secure` `Set-Cookie` attribute}. When truthy, the
   * `Secure` attribute is set, otherwise it is not. By default, the `Secure` attribute is not set.
   *
   * *Note* be careful when setting this to `true`, as compliant clients will
   * not send the cookie back to the server in the future if the browser does
   * not have an HTTPS connection.
   */
  secure?: boolean | undefined;
}
interface CookieListItem
  extends Pick<
    CookieSerializeOptions,
    'domain' | 'path' | 'secure' | 'sameSite' | 'partitioned'
  > {
  /** A string with the name of a cookie. */
  name: string;
  /** A string containing the value of the cookie. */
  value: string;
  /** A number of milliseconds or Date interface containing the expires of the cookie. */
  expires?: number | CookieSerializeOptions['expires'];
}

type RequestCookie = Pick<CookieListItem, 'name' | 'value'>;

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

  const publicHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host;
  const internalHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_INTERNAL_URL!)
    .host;

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
          let cookies = cookieStore.getAll();
          cookies.map((c) => {
            if (c.name.startsWith(`sb-${publicHost?.split('.')[0]}`)) {
              cookies.push({
                name: c.name.replace(
                  `sb-${publicHost?.split('.')[0]}`,
                  `sb-${internalHost?.split('.')[0]}`,
                ),
                value: c.value,
              });
            }
          });

          return cookies;
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
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
//sb-10-auth-token
