import { TagProps } from '@/app/components/contents/SkillTag';
import { Project, Profile } from '@/app/components/card/portfolio/types';
export interface ItemProps {
  mode: 'competition' | 'certificate' | 'link';
  value: string | null;
  url?: string;
  prize?: string;
}

export interface PortfolioDetailProps {
  mode: ItemProps['mode'] | 'skill';
  datas: Array<Omit<ItemProps, 'mode'> | (Omit<TagProps, 'mode'> & { skillId?: number })>;
}

import { Tables } from '@/services/supabase/database.types';
import { MergeDeep } from 'type-fest';

export type { Project };

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  student: ProfileWithProjects['student'];
}

export type ProfileWithProjects = MergeDeep<
  Tables<'profile'>,
  {
    projects: Pick<
      Tables<'projects'>,
      | 'project_id'
      | 'project_name'
      | 'project_thumbnail'
      | 'project_logo'
      | 'description'
      | 'status'
    >[];
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
    student?:
      | Pick<Tables<'student'>, 'name' | 'join_at' | 'graduate_at'> & {
          department: Tables<'departments'>;
          student_jobs:
            | {
                job: Tables<'jobs'>;
              }[]
            | null;
        };
  }
>;

export type PortfolioDetailType = {
  profile_link: Array<{ link: string; alt: string | null }>;
  student: {
    student_certificates: {
      certificates: Pick<
        Tables<'certificates'>,
        'certificate_id' | 'certificate_name'
      >;
    }[];
  };
  profile_competitions: {
    prize: Pick<Tables<'profile_competitions'>, 'prize'>;
    competitions: Pick<
      Tables<'competitions'>,
      'competition_id' | 'competition_name'
    >;
  }[];
  profile_skills: {
    skills: Pick<Tables<'skills'>, 'skill_id' | 'skill_name'>;
  }[];
};

export type ProfileType = Pick<
  Tables<'profile'>,
  'profile_id' | 'profile_name' | 'description' | 'profile_image' | 'owner'
> & {
  student: Pick<Tables<'student'>, 'name' | 'student_number'> & {
    departments: Pick<Tables<'departments'>, 'department_name'>;
  };
};
