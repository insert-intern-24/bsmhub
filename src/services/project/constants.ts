export const PROJECT_SELECT_QUERY = `
  project_id,
  project_name,
  description,
  project_thumbnail,
  profile!projects_owner_fkey (
    profile_id,
    profile_name,
    profile_image,
    is_team
  ),
  project_contributors (
    profile (
      profile_id,
      profile_name,
      profile_image
    )
  )
`;

