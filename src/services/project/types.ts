import { Tables } from '@/services/supabase/database.types';

export type ProjectOwnerProfile = Pick<
  Tables<'profile'>,
  'profile_id' | 'profile_name' | 'profile_image' | 'is_team'
>;

export type ProjectContributor = {
  profile: Pick<
    Tables<'profile'>,
    'profile_id' | 'profile_name' | 'profile_image'
  >;
};

