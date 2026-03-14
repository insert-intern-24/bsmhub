import { NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

const getSafeRelativePath = (value: string | null): string => {
  if (!value) {
    return '/auth/close';
  }

  if (value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }

  return '/auth/close';
};

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = getSafeRelativePath(requestUrl.searchParams.get('next'));

    if (!code) {
      throw new Error('No code provided');
    }

    const supabase = await createClient(true);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth error:', error);
      throw error;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
    return NextResponse.redirect(`${baseUrl}${next}`);
  } catch (error) {
    console.error('Callback error:', error);
    const errorUrl = new URL('/auth/auth-code-error', request.url);
    return NextResponse.redirect(errorUrl.toString());
  }
}
