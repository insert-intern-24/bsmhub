import { PersonalProjectType } from "@/services/server/project/getPersonalProjects";
import { Tables } from "@/utils/supabase/database.types";
import { MergeDeep } from "type-fest";

export type TeamData = MergeDeep<
  Pick<Tables<'profile'>, 'profile_id' | 'profile_name' | 'profile_image' | 'description' | 'created_at'>,
  {
    profile_link: Pick<Tables<'profile_link'>, 'link' | 'alt'>[];
    team_member: {
      profile: Pick<Tables<'profile'>, 'profile_id' | 'profile_image'>[];
    };
  }
>;

export type TeamProjectType = PersonalProjectType & {
  profile: {
    profile_name: string;
  }
}