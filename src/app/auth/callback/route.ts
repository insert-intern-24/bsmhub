import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    // const next = requestUrl.searchParams.get('next') ?? '/';

    if (!code) {
      throw new Error('No code provided');
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth error:', error);
      throw error;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
    // const redirectUrl = `${baseUrl}${next}`;

    // console.log('Redirecting to:', redirectUrl);
    return NextResponse.redirect(`${baseUrl}/auth/close`);
  } catch (error) {
    console.error('Callback error:', error);
    const errorUrl = new URL('/auth/auth-code-error', request.url);
    return NextResponse.redirect(errorUrl.toString());
  }
}
