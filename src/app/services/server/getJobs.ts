import { Tables } from '@/utils/supabase/database.types';
import { createClient } from '@/utils/supabase/server';

export default async function getJobs() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .returns<Tables<'jobs'>[]>();

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return jobs || [];
}
