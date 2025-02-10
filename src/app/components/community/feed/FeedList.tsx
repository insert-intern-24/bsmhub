import React from 'react';
import DefaultFeed from './DefaultFeed';
import { createClient } from '@/utils/supabase/server';

export default async function FeedList() {
  const supabase = await createClient();

  const [communityPostsResult, userProfilesResult] = await Promise.all([
    supabase.from('community_posts').select('*'),
    supabase.from('user_profiles').select('*'),
  ]);

  const { data: community_posts, error: communityPostsError } =
    communityPostsResult;
  const { data: user_profiles, error: userProfilesError } = userProfilesResult;

  if (communityPostsError || userProfilesError) {
    console.error(communityPostsError || userProfilesError);
    return <div>Error loading posts or profiles</div>;
  } else {
    console.log(community_posts, user_profiles);
  }

  return (
    <>
      {community_posts?.map((post) => (
        <DefaultFeed
          key={post.post_id}
          name={post.profile_id}
          time={post.created_at}
          profileImage={'asdf'}
          text={post.context}
        />
      ))}
    </>
  );
}
