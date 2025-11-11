import { Tables } from '@/utils/supabase/database.types';

export type ProjectContributorProfile = Pick<
  Tables<'profile'>,
  'profile_id' | 'profile_name' | 'profile_image'
>;

export type ProjectContributor = {
  profile: ProjectContributorProfile;
};

export type ProjectOwnerProfile = Pick<
  Tables<'profile'>,
  'profile_id' | 'profile_name' | 'profile_image' | 'is_team'
>;

export type ProjectWithContributors = {
  profile: ProjectOwnerProfile;
  project_contributors?: ProjectContributor[] | null;
};

