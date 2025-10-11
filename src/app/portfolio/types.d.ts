import { TagProps } from "@/app/components/contents/SkillTag"

export interface ItemProps {
  mode: 'competition' | 'certificate' | 'link'
  value: string | null
  url?: string
  prize?: string
}

export interface PortfolioDetailProps {
    mode: ItemProps['mode'] | 'skill'
    datas: Array<
        | Omit<ItemProps, 'mode'>
        | Omit<TagProps, 'mode'>
    >
}
import { Tables } from '@/utils/supabase/database.types';
import { MergeDeep } from 'type-fest';

import { Project, Profile } from '../components/card/portfolio/types';

export type { Project };

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  student: ProfileWithProjects['profile_permission']['student'];
}

export type ProfileWithProjects = MergeDeep<
  Tables<'profile'>,
  {
    project_contributors:
      | (Pick<Tables<'project_contributors'>, 'project_id' | 'description'> &
          {
            project: Pick<
              Tables<'projects'>,
              | 'project_id'
              | 'project_name'
              | 'project_thumbnail'
              | 'project_logo'
              | 'description'
              | 'status'
            >;
          }[])
      | null;
    profile_permission: {
      student:
        | Pick<Tables<'student'>, 'name' | 'join_at' | 'graduate_at'> & {
            department: Tables<'departments'>;
            student_jobs: {
              job: Tables<'jobs'>;
            }[];
          };
    }[];
  }
>;
