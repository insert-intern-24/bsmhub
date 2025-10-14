import { Tables } from '@/utils/supabase/database.types';
import { createClient } from '@/utils/supabase/server';

export default async function getJobs() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('job_id, job_name')
    .returns<Tables<'jobs'>[]>();

  if (error) {
    console.error('Failed to fetch jobs from database:', error);
    return [];
  }

  return jobs || [];
}
