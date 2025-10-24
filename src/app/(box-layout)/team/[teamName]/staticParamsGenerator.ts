import { createClient } from '@/utils/supabase/server';

export default async function staticParamsGenerator(): Promise<string[]> {
  const supabase = await createClient(true);
  const { data, error } = await supabase
    .from('profile')
    .select(
      `
      profile_name,
      projects!projects_owner_fkey (
        project_name
      )
      `,
    )
    .eq('is_team', true)
    .returns<
      { profile_name: string; projects: { project_name: string }[] }[]
    >();
  if (error) {
    console.error('Error fetching profile names:', error);
    return [];
  }
  return (
    data?.flatMap((profile) => [
      profile.profile_name,
      ...profile.projects.map(
        (project) => `${profile.profile_name}/${project.project_name}`,
      ),
    ]) || []
  );
}
