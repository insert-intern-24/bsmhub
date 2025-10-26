import { Tables } from '@/utils/supabase/database.types';

export type ProjectDetailRow = Tables<'projects'> & {
  project_html_description: Tables<'project_html_description'> | null;
  project_contributors: Array<
    Tables<'project_contributors'> & {
      profile: Tables<'profile'> | null;
    }
  > | null;
  profile: Pick<Tables<'profile'>, 'profile_name'> | null;
};

export type ProjectDetailViewModel = {
  id: number;
  title: string;
  introduction: string;
  detailDescription: string;
  githubUrl?: string | null;
  iconImage: string;
  technologies: string[];
  team: Array<{
    id: string;
    name: string;
    role: string;
    profileImage: string | null;
  }>;
};
