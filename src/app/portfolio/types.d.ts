import { Tables } from '@/utils/supabase/database.types';
import { MergeDeep } from 'type-fest';

interface PortfolioProject {
  title: string;
  logo: string;
  projectImage: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    role: string;
    bio: string;
    status: string;
    profile_image: string;
  };
  projects: PortfolioProject[];
}

export type ProfileWithProjects = MergeDeep<
  Tables<'profile'>,
  {
    project_contributors:
      | (Pick<Tables<'project_contributors'>, 'project_id' | 'description'> &
          {
            projects: Tables<'projects'>;
          }[])
      | null;
    profile_permission: {
      student?:
        | Pick<Tables<'student'>, 'name' | 'join_at' | 'graduate_at'> & {
            department: Tables<'departments'>;
            student_jobs: {
              job: Tables<'jobs'>;
            }[];
          };
    };
  }
>;
