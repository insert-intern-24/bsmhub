import { PersonalProjectType } from "@/services/project/getPersonalProjects.server";
import { Tables } from "@/services/supabase/database.types";
import { MergeDeep } from "type-fest";

export type TeamData = MergeDeep<
  Omit<Tables<'profile'>, 'email' | 'is_team' | 'link'>,
  {
    profile_link: Pick<Tables<'profile_link'>, 'link' | 'alt'>[];
    team_member: {
      profile: Pick<Tables<'profile'>, 'profile_id' | 'profile_name' | 'profile_image'>;
    }[];
  }
>;

export type TeamProjectType = PersonalProjectType & {
  profile: Pick<Tables<'profile'>, 'profile_name' | 'is_team'>;
  project_contributors: {
    profile: Pick<Tables<'profile'>, 'profile_id' | 'profile_image' | 'profile_name'>;
  }[];
}