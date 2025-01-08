'use server';

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Error during sign in:', error);
      return;
    }

    if (data.url) {
      console.log(data.url);
      // redirect(data.url); // use the redirect API for your server framework
      return NextResponse.redirect(data.url);
    }
  } catch (error) {
    console.error('Unexpected failure:', error);
  }
  return NextResponse.next();
};
