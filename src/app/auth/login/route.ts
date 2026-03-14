'use server';

import { createClient } from '@/services/supabase/server';
import { NextResponse } from 'next/server';

const getSafeRelativePath = (value: string | null): string => {
  if (!value) {
    return '/';
  }

  if (value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }

  return '/';
};

export const GET = async (request: Request) => {
  try {
    const requestUrl = new URL(request.url);
    const next = getSafeRelativePath(requestUrl.searchParams.get('next'));

    const supabase = await createClient(true);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const callbackUrl = new URL('/auth/callback', baseUrl);
    callbackUrl.searchParams.set('next', next);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error('Error during sign in:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data.url) {
      const replacedUrl = data.url.replace(
        process.env.NEXT_PUBLIC_SUPABASE_INTERNAL_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
      );
      console.log(replacedUrl);
      // redirect(data.url); // use the redirect API for your server framework
      return NextResponse.redirect(replacedUrl);
    }
  } catch (error) {
    console.error('Unexpected failure:', error);
  }
  return NextResponse.next();
};
