import React from 'react';
import DefaultFeed from './DefaultFeed';
import { createClient } from '@/utils/supabase/server';

export default async function FeedList() {
  const supabase = await createClient();

  const [communityPostsResult] = await Promise.all([
    supabase.schema('community').from('community_posts').select('*'),
  ]);

  const { data: community_posts, error: communityPostsError } =
    communityPostsResult;

  if (communityPostsError) {
    console.error(communityPostsError);
    return <div>Error loading posts or profiles</div>;
  } else {
    console.log(community_posts);
  }

  return (
    <>
      {community_posts?.map((post) => (
        <DefaultFeed
          key={post.post_id}
          profile_id={post.profile_id}
          time={post.created_at}
          text={post.context}
        />
      ))}
    </>
  );
}
