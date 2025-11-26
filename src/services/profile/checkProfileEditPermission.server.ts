'use server';

import { createClient } from '@/services/supabase/server';

/**
 * Check if the current user has edit permission for a profile
 * @param profileId - The profile ID to check permissions for
 * @returns true if user has edit permission, false otherwise
 */
export async function checkProfileEditPermission(
  profileId: string,
): Promise<boolean> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  // Get profile data
  const { data: profile, error } = await supabase
    .from('profile')
    .select(
      `
      owner,
      is_team,
      team_member!team_member_profile_id_fkey (
        participant_id
      )
    `,
    )
    .eq('profile_id', profileId)
    .single();

  if (error || !profile) {
    return false;
  }

  // Check if user is the owner
  if (profile.owner === user.id) {
    return true;
  }

  // If it's a team, check if user is a team member
  if (profile.is_team && profile.team_member) {
    // Get user's profile ID
    const { data: userProfile } = await supabase
      .from('profile')
      .select('profile_id')
      .eq('owner', user.id)
      .eq('is_team', false)
      .single();

    if (userProfile) {
      const isMember = profile.team_member.some(
        (member: { participant_id: string }) =>
          member.participant_id === userProfile.profile_id,
      );
      if (isMember) {
        return true;
      }
    }
  }

  return false;
}
