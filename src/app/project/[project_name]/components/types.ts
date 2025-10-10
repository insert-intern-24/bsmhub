import { Tables } from '@/utils/supabase/database.types';

export type ProjectDetailRow = Tables<'projects'> & {
  project_markdown: Tables<'project_markdown'> | null;
  project_contributors: Array<
    Tables<'project_contributors'> & {
      profile: Tables<'profile'> | null;
    }
  > | null;
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
    profileImage: string;
  }>;
};
