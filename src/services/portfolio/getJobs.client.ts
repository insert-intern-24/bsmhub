'use client';

import { Tables } from '@/services/supabase/database.types';
import { createClient } from '@/services/supabase/client';

export async function getJobs(): Promise<Tables<'jobs'>[]> {
  const supabase = createClient();

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .returns<Tables<'jobs'>[]>();

  if (error) {
    console.error('Failed to fetch jobs from database:', error);
    return [];
  }

  return jobs || [];
}

