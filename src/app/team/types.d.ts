import { PersonalProjectType } from "@/services/server/project/getPersonalProjects";
import { Tables } from "@/utils/supabase/database.types";
import { MergeDeep } from "type-fest";

export type TeamData = MergeDeep<
  Omit<Tables<'profile'>, 'email' | 'is_team' | 'owner' | 'link'>,
  {
    profile_link: Pick<Tables<'profile_link'>, 'link' | 'alt'>[];
    team_member: {
      profile: Pick<Tables<'profile'>, 'profile_id' | 'profile_image'>;
    }[];
  }
>;

export type TeamProjectType = PersonalProjectType & {
  profile: {
    profile_name: string;
  };
  project_contributors: {
    profile: Pick<Tables<'profile'>, 'profile_id' | 'profile_image' | 'profile_name'>;
  }[];
}