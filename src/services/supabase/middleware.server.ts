import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from './server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = await createClient();

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  try {
    await supabase.auth.getUser();
  } catch (error) {
    // console.error('Supabase auth error:', error);
    // If the refresh token is invalid, we should clear the cookies to prevent
    // the browser from sending the invalid token again and again.
    // This effectively logs the user out.
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: string }).code === 'refresh_token_already_used'
    ) {
      // Clear all cookies
      const cookies = request.cookies.getAll();
      cookies.forEach(({ name }) => {
        if (name.startsWith('sb-')) {
          supabaseResponse.cookies.set(name, '', { maxAge: 0 });
        }
      });
      // Also clear the main response cookies just in case
      request.cookies.getAll().forEach(({ name }) => {
        if (name.startsWith('sb-')) {
          request.cookies.set(name, '');
        }
      });
    }
  }

  // console.log(user);

  // if (
  //   !user &&
  //   !request.nextUrl.pathname.startsWith('/login') &&
  //   !request.nextUrl.pathname.startsWith('/auth')
  // ) {
  //   // no user, potentially respond by redirecting the user to the login page
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
