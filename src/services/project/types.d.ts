import { Tables } from '@/services/supabase/database.types';

export type ProjectDetailRow = Tables<'projects'> & {
  project_html_description: Tables<'project_html_description'> | null;
  project_link: Array<Tables<'project_link'>> | null;
  project_skills: Array<{
    skill_id: number;
    skills: { skill_id: number; skill_name: string } | null;
  }> | null;
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
  links: Array<{ url: string; title: string | null }>;
  iconImage: string;
  technologies: number[];
  team: Array<{
    id: string;
    name: string;
    role: string;
    profileImage: string | null;
  }>;
};

export type ProjectContributor = Tables<'project_contributors'> & {
  profile: Pick<Tables<'profile'>, 'profile_id' | 'profile_image' | 'profile_name'> | null;
};

export type ProjectOwnerProfile = Pick<Tables<'profile'>, 'profile_id' | 'profile_name' | 'profile_image' | 'is_team'>;
